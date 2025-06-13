export interface Marca {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  comentarios: string;
  fotoUrl: string;
  marca: Marca;
  categorias: Categoria[];
  stock: number;
  precio: number;
  activo: boolean;
}