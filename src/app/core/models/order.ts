import { IAddress } from './address';

export interface IOrderToCreate {
  basketId: string;
  deliveryMethodId: number;
  shipToAddress: IAddress;
}
export interface IOrder {
  id: string; // Guid → string
  buyerEmail: string;
  orderDate: string; // DateTimeOffset → string (parse with new Date())
  items: IOrderItem[];
  shipToAddress: IAddress;
  deliveryMethod: string;
  deliveryCost: number;
  status: string;
  subtotal: number;
  total: number;
}

export interface IOrderItem {
  productId: string;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}
