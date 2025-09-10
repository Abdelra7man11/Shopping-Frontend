// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product';
import { IType } from '../models/productType';
import { IBrand } from '../models/productBrand';
import { IPagination } from '../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.apiUrl}/products`;

  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.apiUrl}`);
  }
  // getProducts(queryParams: any): Observable<IPagination<IProduct>> {
  //   let params = new HttpParams();
  //   Object.keys(queryParams).forEach(
  //     (key) => (params = params.set(key, queryParams[key]))
  //   );
  //   return this.http.get<IPagination<IProduct>>(this.apiUrl, { params });
  // }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  getTypes(): Observable<IType[]> {
    return this.http.get<IType[]>(`${this.apiUrl}/types`);
  }

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(`${this.apiUrl}/brands`);
  }
}
