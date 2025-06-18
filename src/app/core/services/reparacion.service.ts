// src/app/core/services/reparacion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  ReparacionClienteForm, 
  ReparacionRequestDTO, 
  ReparacionResponse
} from '../models/reparacion-request.model';

@Injectable({
  providedIn: 'root'
})
export class ReparacionService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Crear solicitud de reparación desde cliente (SIMPLIFICADO)
  crearSolicitudReparacion(formData: ReparacionClienteForm): Observable<ReparacionResponse> {
    const reparacionDTO = this.mapearFormularioADTO(formData);
    return this.http.post<ReparacionResponse>(`${this.baseUrl}/reparaciones`, reparacionDTO);
  }

  // Mapear el formulario SIMPLE al DTO del backend
  private mapearFormularioADTO(formData: ReparacionClienteForm): ReparacionRequestDTO {
    // Generar detalles concatenando los 2 campos
    const detalles = this.generarDetallesSimple(formData);
    
    return {
      usuarioId: 2, // ← Usuario Invitado Genérico (hardcodeado)
      detalles: detalles,
      fechaInicio: formData.fechaInicio.toISOString(),
      fechaEntrega: null,
      precio: 0, // Se definirá después del diagnóstico
      trabajos: [] // Vacío en solicitudes simples
    };
  }

  // Generar detalles SIMPLE concatenando los 2 campos
  private generarDetallesSimple(formData: ReparacionClienteForm): string {
    let template = '=== SOLICITUD DE REPARACIÓN ===\n\n';
    
    template += 'DATOS DE CONTACTO:\n';
    template += `${formData.datosContacto}\n\n`;
    
    template += 'PROBLEMA REPORTADO:\n';
    template += `${formData.problemasReportados}\n\n`;
    
    return template;
  }
}