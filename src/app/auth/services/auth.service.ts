import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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
    // 🔧 USAR URLSearchParams en lugar de FormData
    const body = new URLSearchParams();
    body.set('username', credentials.username);
    body.set('password', credentials.password);

    return this.http.post(`${environment.apiUrl}/login`, body.toString(), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'  // ← CLAVE!
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
        // Incluso si falla el logout en servidor, limpiar cliente
        this.currentUserSubject.next(null);
        console.log('⚠️ Logout local forzado');
        return throwError(() => error);
      })
    );
  }

  // Verificar sesión activa (para cuando recargan la página)
  private checkSession() {
    // Hacer un request a un endpoint protegido para verificar sesión
    this.http.get(`${environment.apiUrl}/usuarios/page`, {
      withCredentials: true,
      params: { page: '0', size: '1' }  // Mínimo request
    }).subscribe({
      next: (response) => {
        console.log('✅ Sesión activa detectada');
        this.fetchUserData();
      },
      error: (error) => {
        console.log('ℹ️ No hay sesión activa');
        this.currentUserSubject.next(null);
      }
    });
  }

  // Obtener datos del usuario actual (placeholder por ahora)
  private fetchUserData() {
    // TODO: Cuando tengas endpoint para usuario actual, usarlo aquí
    // Por ahora, simulamos datos del admin que está en data.sql
    const mockUser: Usuario = {
      email: 'adminm@admin.com',
      nombre: 'Agustin',
      apellido: 'Nieto', 
      rol: 'ADMINISTRADOR'
    };
    
    this.currentUserSubject.next(mockUser);
    console.log('👤 Usuario cargado:', mockUser);
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