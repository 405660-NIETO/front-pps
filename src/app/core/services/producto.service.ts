// src/app/core/services/producto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, Categoria, Marca } from '../models/producto.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Productos con paginación (tu backend)
  obtenerProductos(page: number = 0, size: number = 12): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${environment.endpoints.productos}/page`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  // Producto por ID
  obtenerProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}${environment.endpoints.productos}/${id}`);
  }

  // Categorías para filtros
  obtenerCategorias(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${environment.endpoints.categorias}/page`);
  }

  // Productos con filtros (tu sistema de specifications)
  obtenerProductosConFiltros(filtros: any = {}): Observable<any> {
    let params: any = { page: 0, size: 20, activo: 'true' };
    
    // Agregar todos los filtros que vienen
    if (filtros.page !== undefined) params.page = filtros.page;
    if (filtros.size !== undefined) params.size = filtros.size;
    if (filtros.nombre) params.nombre = filtros.nombre;
    if (filtros.nombreMarca) params.nombreMarca = filtros.nombreMarca;
    if (filtros.categorias) params.categorias = filtros.categorias;
    if (filtros.precioMin) params.precioMin = filtros.precioMin;
    if (filtros.precioMax) params.precioMax = filtros.precioMax;
    if (filtros.stockMin) params.stockMin = filtros.stockMin;
    if (filtros.stockMax) params.stockMax = filtros.stockMax;

    console.log('🌐 HTTP Params que se envían:', params);
    console.log('🌐 URL completa:', `${this.baseUrl}${environment.endpoints.productos}/page`);
    
    return this.http.get<any>(`${this.baseUrl}${environment.endpoints.productos}/page`, { params });
  }
}