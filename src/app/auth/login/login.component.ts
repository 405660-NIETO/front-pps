import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-header bg-primary text-white text-center">
              <h4><i class="bi bi-person-circle"></i> Iniciar Sesión</h4>
              <p class="mb-0">Área administrativa</p>
            </div>
            <div class="card-body">
              
              <!-- Error message -->
              <div *ngIf="error" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> {{error}}
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="login()">
                
                <!-- Email -->
                <div class="mb-3">
                  <label class="form-label">
                    <i class="bi bi-envelope"></i> Email
                  </label>
                  <input 
                    type="email" 
                    class="form-control" 
                    formControlName="email"
                    [class.is-invalid]="isFieldInvalid('email')"
                    placeholder="usuario@email.com">
                  <div class="invalid-feedback">
                    Email es requerido
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label class="form-label">
                    <i class="bi bi-lock"></i> Contraseña
                  </label>
                  <input 
                    type="password" 
                    class="form-control" 
                    formControlName="password"
                    [class.is-invalid]="isFieldInvalid('password')"
                    placeholder="••••••••">
                  <div class="invalid-feedback">
                    Contraseña es requerida
                  </div>
                </div>

                <!-- Login Button -->
                <div class="d-grid">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="loginForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i *ngIf="!loading" class="bi bi-box-arrow-in-right"></i>
                    {{loading ? 'Verificando...' : 'Ingresar'}}
                  </button>
                </div>
              </form>

              <!-- Back to public -->
              <div class="text-center mt-3">
                <a routerLink="/" class="btn btn-outline-secondary btn-sm">
                  <i class="bi bi-arrow-left"></i> Volver al inicio
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      border-radius: 15px;
    }
    .card-header {
      border-radius: 15px 15px 0 0 !important;
    }
    .form-control:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = null;

      const credentials: LoginRequest = {
        username: this.loginForm.value.email,  // Spring Security necesita 'username'
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('🎉 Login exitoso, redirigiendo...');
          this.loading = false;
          
          // Redirigir al admin dashboard
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('💥 Error de login:', error);
          this.loading = false;
          
          // Manejo de errores amigable
          if (error.status === 401) {
            this.error = 'Email o contraseña incorrectos';
          } else if (error.status === 403) {
            this.error = 'Usuario inactivo o sin permisos';
          } else {
            this.error = 'Error de conexión. Verificá que el backend esté funcionando.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}