// src/app/features/catalog/catalog.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { ProductoService } from '../../core/services/producto.service';
import { Producto, Categoria } from '../../core/models/producto.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductCardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  filtrosForm: FormGroup;
  productos: Producto[] = [];
  todasLasCategorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  categoriasSeleccionadas: string[] = [];
  
  // Estados
  cargandoProductos = false;
  error: string | null = null;
  mostrarFiltros = true;
  mostrarDropdownCategorias = false;

  // Paginación
  paginaActual = 0;
  tamanioPagina = 12;
  totalProductos = 0;
  totalPaginas = 0;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {
    this.filtrosForm = this.fb.group({
      nombre: [''],
      nombreMarca: [''],
      precioMin: [''],
      precioMax: [''],
      soloConStock: [''],
      buscarCategoria: ['']
    });
  }

  ngOnInit() {
    this.cargarCategorias();
    this.cargarProductos();
    
    // Cerrar dropdown al hacer click fuera (solo en browser)
    if (typeof document !== 'undefined') {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.position-relative')) {
          this.mostrarDropdownCategorias = false;
        }
      });
    }
  }

  cargarCategorias() {
    this.productoService.obtenerCategorias().subscribe({
      next: (response) => {
        this.todasLasCategorias = response.content || response;
        this.categoriasFiltradas = [...this.todasLasCategorias];
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  cargarProductos() {
    this.cargandoProductos = true;
    this.error = null;

    // Construir filtros
    const filtros = this.construirFiltros();

    this.productoService.obtenerProductosConFiltros(filtros).subscribe({
      next: (response) => {
        console.log('Productos cargados:', response);
        this.productos = response.content || response;
        this.totalProductos = response.totalElements || this.productos.length;
        this.totalPaginas = response.totalPages || 1;
        this.cargandoProductos = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos';
        this.cargandoProductos = false;
      }
    });
  }

  construirFiltros(): any {
    const formValue = this.filtrosForm.value;
    const filtros: any = {
      page: this.paginaActual,
      size: this.tamanioPagina,
      activo: true // ← Solo productos activos
    };

    // Agregar filtros solo si tienen valor
    if (formValue.nombre?.trim()) {
      filtros.nombre = formValue.nombre.trim();
    }
    
    if (formValue.nombreMarca?.trim()) {
      filtros.nombreMarca = formValue.nombreMarca.trim(); // ← Corregido
    }
    
    if (formValue.precioMin) {
      filtros.precioMin = formValue.precioMin;
    }
    
    if (formValue.precioMax) {
      filtros.precioMax = formValue.precioMax;
    }
    
    // Stock dropdown
    if (formValue.soloConStock === 'true') {
      filtros.stockMin = 1; // Solo productos CON stock (>= 1)
      console.log('🟢 Solo CON stock - enviando stockMin=1');
    } else if (formValue.soloConStock === 'false') {
      filtros.stockMin = 0; // Exactamente 0
      filtros.stockMax = 0; // Exactamente 0
      console.log('🔴 Solo SIN stock - enviando stockMin=0, stockMax=0');
    } else {
      console.log('⚪ TODOS los productos - sin filtro de stock');
    }
    // Si es '' (Todos), no agregamos filtro de stock

    // Categorías seleccionadas
    if (this.categoriasSeleccionadas.length > 0) {
      filtros.categorias = this.categoriasSeleccionadas;
    }

    console.log('Filtros enviados al backend:', filtros); // ← Debug

    return filtros;
  }

  aplicarFiltros() {
    this.paginaActual = 0; // Resetear a primera página
    this.cargarProductos();
  }

  limpiarFiltros() {
    this.filtrosForm.reset();
    this.categoriasSeleccionadas = [];
    this.paginaActual = 0;
    this.mostrarFiltros = true;
    this.cargarProductos();
  }

  // === CATEGORÍAS ===
  buscarCategorias(event: any) {
    const termino = event.target.value.toLowerCase();
    this.categoriasFiltradas = this.todasLasCategorias.filter(categoria =>
      categoria.nombre.toLowerCase().includes(termino)
    );
    this.mostrarDropdownCategorias = this.categoriasFiltradas.length > 0;
  }

  seleccionarCategoria(categoria: Categoria) {
    if (!this.categoriasSeleccionadas.includes(categoria.nombre)) {
      this.categoriasSeleccionadas.push(categoria.nombre);
    }
    this.filtrosForm.patchValue({ buscarCategoria: '' });
    this.mostrarDropdownCategorias = false;
  }

  quitarCategoria(nombreCategoria: string) {
    this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(
      cat => cat !== nombreCategoria
    );
  }

  // === PAGINACIÓN ===
  irAPagina(pagina: number) {
    if (pagina >= 0 && pagina < this.totalPaginas && pagina !== this.paginaActual) {
      this.paginaActual = pagina;
      this.cargarProductos();
      
      // Scroll al top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  obtenerPaginasVisibles(): number[] {
    const paginas: number[] = [];
    const rango = 2; // Mostrar 2 páginas a cada lado de la actual

    let inicio = Math.max(0, this.paginaActual - rango);
    let fin = Math.min(this.totalPaginas - 1, this.paginaActual + rango);

    // Ajustar para mostrar siempre 5 páginas si es posible
    if (fin - inicio < 4) {
      if (inicio === 0) {
        fin = Math.min(this.totalPaginas - 1, inicio + 4);
      } else if (fin === this.totalPaginas - 1) {
        inicio = Math.max(0, fin - 4);
      }
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }
}