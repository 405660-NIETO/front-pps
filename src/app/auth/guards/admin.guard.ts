import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('🛡️ AdminGuard: Verificando acceso...');
    
    // Verificar si está autenticado
    if (!this.authService.isAuthenticated()) {
      console.log('❌ No autenticado, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si es admin
    if (!this.authService.isAdmin()) {
      console.log('❌ No es admin, acceso denegado');
      // TODO: Crear página de "sin permisos"
      alert('No tenés permisos para acceder a esta área');
      this.router.navigate(['/']);
      return false;
    }

    console.log('✅ Acceso concedido para admin');
    return true;
  }
}
