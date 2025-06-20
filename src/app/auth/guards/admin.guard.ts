import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    console.log('🛡️ AdminGuard: Verificando acceso...');
    
    // 🔧 ESPERAR a que el currentUser$ emita un valor definitivo
    return this.authService.currentUser$.pipe(
      take(1), // Solo tomar el primer valor
      switchMap(user => {
        console.log('🔍 AdminGuard recibió usuario:', user);
        
        // Si no hay usuario, verificar sesión activa
        if (!user) {
          console.log('⏳ No hay usuario, verificando sesión...');
          return this.authService.verifySession().pipe(
            map(sessionActive => {
              if (sessionActive) {
                // Sesión activa pero usuario no cargado aún, esperar un poco más
                return this.checkUserAfterSession();
              } else {
                // No hay sesión activa
                console.log('❌ No hay sesión activa, redirigiendo a login');
                this.router.navigate(['/login']);
                return false;
              }
            })
          );
        }
        
        // Si hay usuario, verificar rol
        if (user.rol !== 'ADMINISTRADOR') {
          console.log('❌ No es admin, acceso denegado');
          alert('No tenés permisos para acceder a esta área');
          this.router.navigate(['/']);
          return of(false);
        }
        
        console.log('✅ Acceso concedido para admin');
        return of(true);
      })
    );
  }

  private checkUserAfterSession(): boolean {
    // Verificar usuario actual después de confirmar sesión
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      console.log('❌ Sesión activa pero sin usuario, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }
    
    if (currentUser.rol !== 'ADMINISTRADOR') {
      console.log('❌ No es admin, acceso denegado');
      alert('No tenés permisos para acceder a esta área');
      this.router.navigate(['/']);
      return false;
    }
    
    console.log('✅ Acceso concedido para admin');
    return true;
  }
}