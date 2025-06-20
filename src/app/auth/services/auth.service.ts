import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;  // Spring Security espera 'username', no 'email'
  password: string;
}

export interface Usuario {
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar si ya hay sesión activa al cargar la app
    this.checkSession();
  }

  login(credentials: LoginRequest): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', credentials.username);
    body.set('password', credentials.password);

    return this.http.post(`${environment.apiUrl}/login`, body.toString(), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      responseType: 'json'
    }).pipe(
      tap((response) => {
        console.log('✅ Login exitoso:', response);
        this.fetchUserData();
      }),
      catchError((error) => {
        console.error('❌ Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        console.log('✅ Logout exitoso');
      }),
      catchError((error) => {
        this.currentUserSubject.next(null);
        console.log('⚠️ Logout local forzado');
        return throwError(() => error);
      })
    );
  }

  // ✅ VERSIÓN FINAL: checkSession() usando /auth/me
  private checkSession() {
    this.http.get<Usuario>(`${environment.apiUrl}/auth/me`, {
      withCredentials: true
    }).subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
        console.log('✅ Sesión activa detectada, usuario cargado:', user);
      },
      error: (error) => {
        console.log('ℹ️ No hay sesión activa');
        this.currentUserSubject.next(null);
      }
    });
  }

  // ✅ VERSIÓN FINAL: fetchUserData() usando /auth/me
  private fetchUserData() {
    this.http.get<Usuario>(`${environment.apiUrl}/auth/me`, {
      withCredentials: true
    }).subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
        console.log('👤 Usuario cargado desde API:', user);
      },
      error: (error) => {
        console.error('❌ Error obteniendo usuario:', error);
        this.currentUserSubject.next(null);
      }
    });
  }

  // ✅ VERSIÓN FINAL: verifySession() usando /auth/me
  verifySession(): Observable<boolean> {
    return this.http.get<Usuario>(`${environment.apiUrl}/auth/me`, {
      withCredentials: true
    }).pipe(
      map((user) => {
        console.log('✅ Sesión verificada por guard, usuario:', user);
        this.currentUserSubject.next(user);
        return true;
      }),
      catchError((error) => {
        console.log('❌ No hay sesión activa (verificado por guard)');
        this.currentUserSubject.next(null);
        return of(false);
      })
    );
  }

  // Getters útiles para guards
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.rol === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMINISTRADOR');
  }
}