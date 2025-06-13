import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FacturaRequest {
  usuarioId: number;
  sedeId: number;
  formaPagoId: number;
  clienteNombre?: string;
  clienteApellido?: string;
  clienteDocumento?: string;
  clienteTelefono?: string;
  clienteCelular?: string;
  clienteEmail?: string;
  productos: DetalleFacturaRequest[];
}

export interface DetalleFacturaRequest {
  productoId: number;
  cantidad: number;
  precio: number;
}

export interface Sede {
  id: number;
  nombre: string;
  direccion: string;
  activo: boolean;
}

export interface FormaPago {
  id: number;
  nombre: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener sedes para el dropdown
  obtenerSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.baseUrl}/sedes`);
  }

  // Obtener formas de pago para el dropdown  
  obtenerFormasPago(): Observable<FormaPago[]> {
    return this.http.get<FormaPago[]>(`${this.baseUrl}/facturas/formapago`);
  }

  // Crear factura (tu endpoint POST /facturas)
  crearFactura(facturaRequest: FacturaRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/facturas`, facturaRequest);
  }
}