// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${environment.apiUrl}/products`);
  }
  getProductById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${id}`);
  }

  getAllTypes(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/types`);
  }

  getAllBrands(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/brands`);
  }
}
