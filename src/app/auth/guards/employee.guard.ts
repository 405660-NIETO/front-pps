import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    console.log('🛡️ EmployeeGuard: Verificando acceso de empleado...');
    
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap(user => {
        console.log('🔍 EmployeeGuard recibió usuario:', user);
        
        if (!user) {
          console.log('⏳ No hay usuario, verificando sesión...');
          return this.authService.verifySession().pipe(
            map(sessionActive => {
              if (sessionActive) {
                return this.checkUserAfterSession();
              } else {
                console.log('❌ No hay sesión activa, redirigiendo a login');
                this.router.navigate(['/login']);
                return false;
              }
            })
          );
        }
        
        // Verificar si tiene rol de empleado (ADMIN, EMPLEADO, o LUTHIER)
        if (!this.hasEmployeeAccess(user.rol)) {
          console.log('❌ No tiene acceso de empleado, acceso denegado');
          alert('No tenés permisos para acceder a esta área');
          this.router.navigate(['/']);
          return of(false);
        }
        
        console.log('✅ Acceso concedido para empleado');
        return of(true);
      })
    );
  }

  private checkUserAfterSession(): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      console.log('❌ Sesión activa pero sin usuario, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }
    
    if (!this.hasEmployeeAccess(currentUser.rol)) {
      console.log('❌ No tiene acceso de empleado, acceso denegado');
      alert('No tenés permisos para acceder a esta área');
      this.router.navigate(['/']);
      return false;
    }
    
    console.log('✅ Acceso concedido para empleado');
    return true;
  }

  private hasEmployeeAccess(rol: string): boolean {
    return ['ADMINISTRADOR', 'EMPLEADO', 'LUTHIER'].includes(rol);
  }
}