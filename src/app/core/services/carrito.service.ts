// src/app/core/services/carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CarritoItem, Carrito } from '../models/carrito.model';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<Carrito>({
    items: [],
    total: 0,
    cantidadTotal: 0
  });

  public carrito$ = this.carritoSubject.asObservable();

  constructor() {}

  agregarProducto(producto: Producto, cantidad: number = 1) {
    const carritoActual = this.carritoSubject.value;
    const itemExistente = carritoActual.items.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.producto.precio;
    } else {
      const nuevoItem: CarritoItem = {
        producto,
        cantidad,
        subtotal: cantidad * producto.precio
      };
      carritoActual.items.push(nuevoItem);
    }

    this.actualizarCarrito(carritoActual);
  }

  eliminarProducto(productoId: number) {
    const carritoActual = this.carritoSubject.value;
    carritoActual.items = carritoActual.items.filter(item => item.producto.id !== productoId);
    this.actualizarCarrito(carritoActual);
  }

  actualizarCantidad(productoId: number, cantidad: number) {
    const carritoActual = this.carritoSubject.value;
    const item = carritoActual.items.find(item => item.producto.id === productoId);
    
    if (item) {
      item.cantidad = cantidad;
      item.subtotal = cantidad * item.producto.precio;
      this.actualizarCarrito(carritoActual);
    }
  }

  limpiarCarrito() {
    this.carritoSubject.next({
      items: [],
      total: 0,
      cantidadTotal: 0
    });
  }

  obtenerCarrito(): Carrito {
    return this.carritoSubject.value;
  }

  private actualizarCarrito(carrito: Carrito) {
    carrito.total = carrito.items.reduce((total, item) => total + item.subtotal, 0);
    carrito.cantidadTotal = carrito.items.reduce((total, item) => total + item.cantidad, 0);
    this.carritoSubject.next(carrito);
  }
}