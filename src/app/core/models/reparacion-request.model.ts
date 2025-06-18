// src/app/core/models/reparacion-request.model.ts

// Modelo SIMPLIFICADO para el formulario del cliente (frontend)
export interface ReparacionClienteForm {
  datosContacto: string;      // Email, teléfono, nombre - todo en un campo
  problemasReportados: string; // Qué le pasa al instrumento
  fechaInicio: Date;          // Cuándo planea traerlo
}

// DTO que se envía al backend (mapea a tu ReparacionDTO existente)
export interface ReparacionRequestDTO {
  usuarioId: number | null;  // null para requests de clientes
  detalles: string;          // Template generado con datos del cliente
  fechaInicio: string | null; // ISO string
  fechaEntrega: string | null; // null para requests iniciales
  precio: number;            // 0 para requests iniciales
  trabajos: string[];        // Array de nombres de trabajos
}

// Respuesta del backend después de crear la reparación
export interface ReparacionResponse {
  id: number;
  usuario: any;
  trabajos: any[];
  detalles: string;
  fechaInicio: string;
  fechaEntrega: string | null;
  precio: number;
  activo: boolean;
}

// Trabajos disponibles (para los checkboxes)
export interface TrabajoDisponible {
  id: number;
  nombre: string;
  activo: boolean;
}