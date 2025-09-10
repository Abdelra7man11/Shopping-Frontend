import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { IBasket } from '../models/basket';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private apiUrl = `${environment.apiUrl}/baskets`;

  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();
  constructor(private http: HttpClient) {}

  // ✅ Get basket from API
  getBasket(key: string): Observable<IBasket> {
    return this.http.get<IBasket>(`${this.apiUrl}?key=${key}`);
  }

  // ✅ Create or update basket
  createOrUpdateBasket(basket: IBasket): Observable<IBasket> {
    return this.http.post<IBasket>(this.apiUrl, basket);
  }

  // ✅ Delete basket
  deleteBasket(key: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${key}`);
  }
  // ✅ cache update

  setBasketState(basket: IBasket | null) {
    this.basketSource.next(basket);
  }

  getCurrentBasketValue(): IBasket | null {
    return this.basketSource.value;
  }
}
