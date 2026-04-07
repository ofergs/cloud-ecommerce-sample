export interface Product {
  pk: string;       // "PRODUCT#<id>"
  sk: string;       // "PRODUCT#<id>"
  id: string;
  name: string;
  description: string;
  price: number;    // in cents
  imageUrl?: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductInput = Omit<Product, 'pk' | 'sk' | 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductInput = Partial<CreateProductInput>;
