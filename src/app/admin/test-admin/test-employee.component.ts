import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../auth/services/auth.service';

@Component({
  selector: 'app-test-employee',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          
          <!-- Success Card -->
          <div class="card border-primary">
            <div class="card-header bg-primary text-white text-center">
              <h3><i class="bi bi-people-fill"></i> ¡Área de Empleados!</h3>
              <p class="mb-0">Acceso para ADMIN + EMPLEADO + LUTHIER</p>
            </div>
            <div class="card-body">
              
              <!-- User Info -->
              <div class="alert alert-info" *ngIf="currentUser">
                <h5><i class="bi bi-person-badge"></i> Empleado Autenticado:</h5>
                <ul class="mb-0">
                  <li><strong>Nombre:</strong> {{currentUser.nombre}} {{currentUser.apellido}}</li>
                  <li><strong>Email:</strong> {{currentUser.email}}</li>
                  <li><strong>Rol:</strong> 
                    <span class="badge" [class]="getRoleBadgeClass()">{{currentUser.rol}}</span>
                  </li>
                </ul>
              </div>

              <!-- Role-specific Messages -->
              <div class="row text-center">
                <div class="col-md-4" *ngIf="currentUser?.rol === 'ADMINISTRADOR'">
                  <div class="card bg-danger text-white mb-3">
                    <div class="card-body">
                      <i class="bi bi-crown-fill display-4"></i>
                      <h6 class="mt-2">Administrador</h6>
                      <small>Acceso total al sistema</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4" *ngIf="currentUser?.rol === 'EMPLEADO'">
                  <div class="card bg-success text-white mb-3">
                    <div class="card-body">
                      <i class="bi bi-person-workspace display-4"></i>
                      <h6 class="mt-2">Empleado</h6>
                      <small>Gestión de productos y ventas</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4" *ngIf="currentUser?.rol === 'LUTHIER'">
                  <div class="card bg-warning text-dark mb-3">
                    <div class="card-body">
                      <i class="bi bi-tools display-4"></i>
                      <h6 class="mt-2">Luthier</h6>
                      <small>Especialista en reparaciones</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Access Matrix -->
              <div class="alert alert-secondary">
                <h6><i class="bi bi-shield-check"></i> Tu acceso incluye:</h6>
                <div class="row">
                  <div class="col-md-6">
                    <ul class="mb-0">
                      <li *ngIf="canAccess('admin')">✅ Área administrativa</li>
                      <li *ngIf="canAccess('products')">✅ Gestión de productos</li>
                      <li *ngIf="canAccess('repairs')">✅ Gestión de reparaciones</li>
                    </ul>
                  </div>
                  <div class="col-md-6">
                    <ul class="mb-0">
                      <li *ngIf="canAccess('users')">✅ Gestión de usuarios</li>
                      <li *ngIf="canAccess('reports')">✅ Reportes y métricas</li>
                      <li>✅ Área de empleados (esta página)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex gap-2 justify-content-center">
                <button class="btn btn-outline-danger" (click)="logout()">
                  <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                </button>
                <button class="btn btn-success" (click)="testReparacionesEndpoint()">
                  <i class="bi bi-tools"></i> Test Reparaciones
                </button>
                <a routerLink="/admin/test" class="btn btn-outline-primary" *ngIf="currentUser?.rol === 'ADMINISTRADOR'">
                  <i class="bi bi-shield-lock"></i> Área Admin
                </a>
                <a routerLink="/" class="btn btn-outline-secondary">
                  <i class="bi bi-house"></i> Volver al Inicio
                </a>
              </div>

              <!-- Test Result -->
              <div *ngIf="testResult" class="mt-3">
                <div class="alert" [class]="testResult.success ? 'alert-success' : 'alert-danger'">
                  <strong>Test Resultado:</strong> {{testResult.message}}
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
export class TestEmployeeComponent implements OnInit {
  currentUser: Usuario | null = null;
  testResult: { success: boolean; message: string } | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('👤 Usuario en TestEmployee:', user);
    });
  }

  getRoleBadgeClass(): string {
    switch (this.currentUser?.rol) {
      case 'ADMINISTRADOR': return 'bg-danger';
      case 'EMPLEADO': return 'bg-success';
      case 'LUTHIER': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  canAccess(feature: string): boolean {
    const rol = this.currentUser?.rol;
    if (!rol) return false;

    switch (feature) {
      case 'admin': return rol === 'ADMINISTRADOR';
      case 'users': return rol === 'ADMINISTRADOR';
      case 'products': return ['ADMINISTRADOR', 'EMPLEADO', 'LUTHIER'].includes(rol);
      case 'repairs': return ['ADMINISTRADOR', 'EMPLEADO', 'LUTHIER'].includes(rol);
      case 'reports': return ['ADMINISTRADOR', 'EMPLEADO', 'LUTHIER'].includes(rol);
      default: return false;
    }
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
          this.router.navigate(['/login']);
        }
      });
    }
  }

  testReparacionesEndpoint() {
    console.log('🧪 Testing reparaciones endpoint...');
    this.testResult = null;

    this.authService['http'].get('http://localhost:8080/reparaciones/page', {
      withCredentials: true,
      params: { page: '0', size: '3' }
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Reparaciones call exitoso:', response);
        this.testResult = {
          success: true,
          message: `Conectado! Encontradas ${response.totalElements} reparaciones en el sistema.`
        };
      },
      error: (error) => {
        console.error('❌ Reparaciones call falló:', error);
        this.testResult = {
          success: false,
          message: `Error ${error.status}: ${error.error?.message || 'No se pudo conectar al backend'}`
        };
      }
    });
  }
}