export interface CartItem {
  pk: string;       // "CART#<userId>"
  sk: string;       // "ITEM#<productId>"
  userId: string;
  productId: string;
  productName: string;
  price: number;    // in cents, snapshot at add time
  quantity: number;
  addedAt: string;
}

export type AddCartItemInput = Pick<CartItem, 'productId' | 'quantity'>;
export type UpdateCartItemInput = Pick<CartItem, 'quantity'>;
