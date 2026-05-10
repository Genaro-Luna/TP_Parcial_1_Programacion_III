import type { ICategory } from "./categoria.ts";

export interface Product {
  id: number;
  eliminado: boolean;
  createdAt: string;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
  disponible: boolean;
    categorias: ICategory[];
}

export interface CartItem {
  producto: Product;
  cantidad: number;
}