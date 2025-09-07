import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrder, IOrderToCreate } from '../models/order';
import { IDeliveryMethod } from '../models/deliveryMethod';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) {}

  // Get all orders for logged-in user
  getAllOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.apiUrl);
  }

  // getAllOrders() {
  //   const token = localStorage.getItem('token');
  //   return this.http.get<IOrder[]>(this.apiUrl, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  // }

  // Get order by Id
  getOrderById(id: string): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.apiUrl}/${id}`);
  }

  // Create new order
  createOrder(order: IOrderToCreate): Observable<IOrder> {
    return this.http.post<IOrder>(this.apiUrl, order);
  }

  // Get delivery methods
  getDeliveryMethods(): Observable<IDeliveryMethod[]> {
    return this.http.get<IDeliveryMethod[]>(`${this.apiUrl}/deliveryMethods`);
  }
}
