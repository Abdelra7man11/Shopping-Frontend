import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrderToCreate, IOrder } from '../models/order';
import { IDeliveryMethod } from '../models/deliveryMethod';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(order: IOrderToCreate): Observable<IOrder> {
    return this.http.post<IOrder>(this.apiUrl, order);
  }

  getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.apiUrl}/${id}`);
  }

  getDeliveryMethods(): Observable<IDeliveryMethod[]> {
    return this.http.get<IDeliveryMethod[]>(`${this.apiUrl}/deliveryMethods`);
  }
}
