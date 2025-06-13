import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  productosDestacados: Producto[] = [];
  loading = true;
  error: string | null = null;

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarProductosDestacados();
  }

  cargarProductosDestacados() {
    this.loading = true;
    this.error = null;

    // Obtener primeros 8 productos como "destacados"
    this.productoService.obtenerProductos(0, 8).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        this.productosDestacados = response.content || response; // Adaptarse a paginación
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos. Verificá que el backend esté funcionando.';
        this.loading = false;
      }
    });
  }
}