import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../auth/services/auth.service';

@Component({
  selector: 'app-test-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          
          <!-- Success Card -->
          <div class="card border-success">
            <div class="card-header bg-success text-white text-center">
              <h3><i class="bi bi-check-circle-fill"></i> ¡Funciona Perfectamente!</h3>
            </div>
            <div class="card-body">
              
              <!-- User Info -->
              <div class="alert alert-info" *ngIf="currentUser">
                <h5><i class="bi bi-person-circle"></i> Usuario Autenticado:</h5>
                <ul class="mb-0">
                  <li><strong>Nombre:</strong> {{currentUser.nombre}} {{currentUser.apellido}}</li>
                  <li><strong>Email:</strong> {{currentUser.email}}</li>
                  <li><strong>Rol:</strong> 
                    <span class="badge bg-primary">{{currentUser.rol}}</span>
                  </li>
                </ul>
              </div>

              <!-- Success Messages -->
              <div class="row text-center">
                <div class="col-md-4">
                  <div class="card bg-light mb-3">
                    <div class="card-body">
                      <i class="bi bi-shield-check text-success display-4"></i>
                      <h6 class="mt-2">Spring Security</h6>
                      <small class="text-muted">Autenticación exitosa</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card bg-light mb-3">
                    <div class="card-body">
                      <i class="bi bi-lock-fill text-primary display-4"></i>
                      <h6 class="mt-2">AdminGuard</h6>
                      <small class="text-muted">Acceso autorizado</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card bg-light mb-3">
                    <div class="card-body">
                      <i class="bi bi-cookie text-warning display-4"></i>
                      <h6 class="mt-2">Session Cookie</h6>
                      <small class="text-muted">Funcionando con HttpOnly</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Next Steps -->
              <div class="alert alert-primary">
                <h6><i class="bi bi-lightbulb"></i> Próximos pasos:</h6>
                <ol class="mb-0">
                  <li>✅ Login + Spring Security funcionando</li>
                  <li>✅ Guards por rol implementados</li>
                  <li>🔄 Crear layout administrativo</li>
                  <li>🔄 Implementar gestión de usuarios</li>
                  <li>🔄 Añadir gestión de productos</li>
                </ol>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex gap-2 justify-content-center">
                <button class="btn btn-outline-danger" (click)="logout()">
                  <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                </button>
                <button class="btn btn-primary" (click)="testBackendCall()">
                  <i class="bi bi-server"></i> Test Backend Call
                </button>
                <a routerLink="/" class="btn btn-outline-secondary">
                  <i class="bi bi-house"></i> Volver al Inicio
                </a>
              </div>

              <!-- Backend Test Result -->
              <div *ngIf="backendTestResult" class="mt-3">
                <div class="alert" [class]="backendTestResult.success ? 'alert-success' : 'alert-danger'">
                  <strong>Test Backend:</strong> {{backendTestResult.message}}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .display-4 {
      font-size: 2.5rem;
    }
    .card {
      transition: transform 0.2s ease;
    }
    .card:hover {
      transform: translateY(-2px);
    }
  `]
})
export class TestAdminComponent implements OnInit {
  currentUser: Usuario | null = null;
  backendTestResult: { success: boolean; message: string } | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('👤 Usuario en TestAdmin:', user);
    });
  }

  logout() {
    if (confirm('¿Estás seguro que querés cerrar sesión?')) {
      this.authService.logout().subscribe({
        next: () => {
          console.log('👋 Logout exitoso');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('💥 Error en logout:', error);
          // Redirigir de todas formas
          this.router.navigate(['/login']);
        }
      });
    }
  }

  testBackendCall() {
    console.log('🧪 Testing backend call...');
    this.backendTestResult = null;

    // Hacer una llamada a un endpoint protegido para verificar que funcione
    this.authService['http'].get('http://localhost:8080/usuarios/page', {
      withCredentials: true,
      params: { page: '0', size: '5' }
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Backend call exitoso:', response);
        this.backendTestResult = {
          success: true,
          message: `Conectado! Encontrados ${response.totalElements} usuarios en el sistema.`
        };
      },
      error: (error) => {
        console.error('❌ Backend call falló:', error);
        this.backendTestResult = {
          success: false,
          message: `Error ${error.status}: ${error.error?.message || 'No se pudo conectar al backend'}`
        };
      }
    });
  }
}