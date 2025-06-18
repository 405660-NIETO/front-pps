// src/app/features/repair-request/repair-request.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReparacionService } from '../../core/services/reparacion.service';
import { ReparacionClienteForm } from '../../core/models/reparacion-request.model';

@Component({
  selector: 'app-repair-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './repair-request.component.html',
  styleUrl: './repair-request.component.css'
})
export class RepairRequestComponent implements OnInit {
  repairForm: FormGroup;
  
  // Estados
  enviandoSolicitud = false;
  solicitudEnviada = false;
  error: string | null = null;
  
  // Datos de respuesta
  reparacionId: number | null = null;
  
  // Fecha mínima para el input date
  fechaMinima = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private reparacionService: ReparacionService
  ) {
    this.repairForm = this.fb.group({
      // 3 campos SIMPLES con límites de caracteres
      datosContacto: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(80)]],
      problemasReportados: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(120)]],
      fechaInicio: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Ya no necesitamos cargar trabajos - formulario simple
  }

  // Enviar solicitud SIMPLIFICADA
  enviarSolicitud() {
    if (this.repairForm.valid) {
      this.enviandoSolicitud = true;
      this.error = null;

      const formData: ReparacionClienteForm = {
        datosContacto: this.repairForm.value.datosContacto,
        problemasReportados: this.repairForm.value.problemasReportados,
        fechaInicio: new Date(this.repairForm.value.fechaInicio)
      };

      this.reparacionService.crearSolicitudReparacion(formData).subscribe({
        next: (response) => {
          console.log('Solicitud enviada exitosamente:', response);
          this.reparacionId = response.id;
          this.solicitudEnviada = true;
          this.enviandoSolicitud = false;
        },
        error: (err) => {
          console.error('Error al enviar solicitud:', err);
          this.error = 'No se pudo enviar la solicitud. Por favor intentá nuevamente.';
          this.enviandoSolicitud = false;
        }
      });
    } else {
      this.marcarCamposComoTocados();
    }
  }

  private marcarCamposComoTocados() {
    Object.keys(this.repairForm.controls).forEach(key => {
      this.repairForm.get(key)?.markAsTouched();
    });
  }

  // Resetear formulario para nueva solicitud
  nuevaSolicitud() {
    this.solicitudEnviada = false;
    this.reparacionId = null;
    this.repairForm.reset();
    this.error = null;
  }

  // Helpers para validación en template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.repairForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.repairForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo es obligatorio';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}