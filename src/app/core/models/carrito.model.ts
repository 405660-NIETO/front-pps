import { Producto } from './producto.model';

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export interface Carrito {
  items: CarritoItem[];
  total: number;
  cantidadTotal: number;
}