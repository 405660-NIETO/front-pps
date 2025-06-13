import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../core/models/producto.model';
import { CarritoService } from '../../core/services/carrito.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() producto!: Producto;

  constructor(private carritoService: CarritoService) {}

  agregarAlCarrito() {
    if (this.producto.stock > 0) {
      this.carritoService.agregarProducto(this.producto, 1);
      // TODO: Mostrar notificación de éxito
    }
  }
}