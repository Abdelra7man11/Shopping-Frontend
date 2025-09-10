export interface IBasketItem {
  id: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface IBasket {
  id: string;
  items: IBasketItem[];
  clientSecret?: string | null;
  paymentIntentId?: string | null;
  deliveryMethodId?: number | null;
  shippingPrice?: number | null;
}

export interface IBasketTotals {
  shipping: number;
  subtotal: number;
  total: number;
}
