import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { CheckoutService, FacturaRequest, DetalleFacturaRequest, Sede, FormaPago } from '../../core/services/checkout.service';
import { Carrito } from '../../core/models/carrito.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  carrito: Carrito = { items: [], total: 0, cantidadTotal: 0 };
  sedes: Sede[] = [];
  formasPago: FormaPago[] = [];
  procesandoCompra = false;

  constructor(
    private fb: FormBuilder,
    private carritoService: CarritoService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      clienteNombre: [''],
      clienteApellido: [''],
      clienteEmail: [''],
      clienteTelefono: [''],
      clienteCelular: [''],
      clienteDocumento: [''],
      sedeId: ['', Validators.required],
      formaPagoId: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Obtener carrito actual
    this.carritoService.carrito$.subscribe(carrito => {
      this.carrito = carrito;
    });

    // Cargar datos para dropdowns
    this.cargarSedes();
    this.cargarFormasPago();
  }

  cargarSedes() {
    this.checkoutService.obtenerSedes().subscribe({
      next: (sedes) => {
        this.sedes = sedes.filter(sede => sede.activo);
      },
      error: (err) => {
        console.error('Error al cargar sedes:', err);
      }
    });
  }

  cargarFormasPago() {
    this.checkoutService.obtenerFormasPago().subscribe({
      next: (formas) => {
        this.formasPago = formas.filter(forma => forma.activo);
      },
      error: (err) => {
        console.error('Error al cargar formas de pago:', err);
      }
    });
  }

  realizarCompra() {
    if (this.checkoutForm.valid && this.carrito.items.length > 0) {
      this.procesandoCompra = true;

      // Mapear carrito a DetalleFacturaRequest[]
      const productos: DetalleFacturaRequest[] = this.carrito.items.map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        precio: item.producto.precio
      }));

      // Crear FacturaRequest
      const facturaRequest: FacturaRequest = {
        usuarioId: 5, // Hardcodeado como dijiste (temporal)
        sedeId: parseInt(this.checkoutForm.get('sedeId')?.value),
        formaPagoId: parseInt(this.checkoutForm.get('formaPagoId')?.value),
        clienteNombre: this.checkoutForm.get('clienteNombre')?.value || null,
        clienteApellido: this.checkoutForm.get('clienteApellido')?.value || null,
        clienteDocumento: this.checkoutForm.get('clienteDocumento')?.value || null,
        clienteTelefono: this.checkoutForm.get('clienteTelefono')?.value || null,
        clienteCelular: this.checkoutForm.get('clienteCelular')?.value || null,
        clienteEmail: this.checkoutForm.get('clienteEmail')?.value || null,
        productos: productos
      };

      // Enviar a tu backend
      this.checkoutService.crearFactura(facturaRequest).subscribe({
        next: (response) => {
          console.log('Factura creada exitosamente:', response);
          
          // Limpiar carrito
          this.carritoService.limpiarCarrito();
          
          // Redirigir o mostrar éxito
          alert(`¡Compra realizada con éxito! 
          Factura ID: ${response.id}
          Total: $${response.detalles?.reduce((sum: number, d: any) => sum + d.subtotal, 0) || this.carrito.total}
          
          Podés retirar tus productos en la sede seleccionada.`);
          
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al procesar compra:', err);
          alert('Error al procesar la compra. Por favor intentá nuevamente.');
          this.procesandoCompra = false;
        }
      });
    }
  }
}