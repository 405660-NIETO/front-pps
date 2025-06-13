import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { Carrito } from '../../core/models/carrito.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  carrito: Carrito = {
    items: [],
    total: 0,
    cantidadTotal: 0
  };

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe(carrito => {
      this.carrito = carrito;
    });
  }

  cambiarCantidad(productoId: number, nuevaCantidad: number) {
    if (nuevaCantidad > 0) {
      this.carritoService.actualizarCantidad(productoId, nuevaCantidad);
    }
  }

  onCantidadChange(productoId: number, event: any) {
    const nuevaCantidad = parseInt(event.target.value);
    if (nuevaCantidad > 0) {
      this.carritoService.actualizarCantidad(productoId, nuevaCantidad);
    }
  }

  eliminarItem(productoId: number) {
    if (confirm('¿Estás seguro que querés eliminar este producto del carrito?')) {
      this.carritoService.eliminarProducto(productoId);
    }
  }

  limpiarCarrito() {
    if (confirm('¿Estás seguro que querés vaciar todo el carrito?')) {
      this.carritoService.limpiarCarrito();
    }
  }
}