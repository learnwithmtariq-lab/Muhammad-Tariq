export interface Product {
  id: string;
  name: string;
  weight: string;
  price: number;
  salePrice: number;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}
