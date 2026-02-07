import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { IPagination } from '../models/pagination';
import { IProduct } from '../models/product';
import { IType } from '../models/productType';
import { IBrand } from '../models/productBrand';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  productsPagination = signal<IPagination<IProduct>>({
    pageNumber: 1,
    pageSize: 10,
    count: 0,
    data: [],
  });

  isLoading = signal(false);

  constructor(private http: HttpClient) { }

  getAllProducts(params: any) {
    this.isLoading.set(true);

    const queryParams: any = {};
    for (const key in params) {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ''
      ) {
        queryParams[key] = params[key].toString();
      }
    }

    this.http
      .get<IPagination<IProduct>>(this.apiUrl, { params: queryParams })
      .subscribe({
        next: (res) => this.productsPagination.set(res),
        error: (err) => console.error('Error loading products', err),
        complete: () => this.isLoading.set(false),
      });
  }
  // getAllProducts(pageNumber: number, pageSize: number) {
  //   this.isLoading.set(true);
  //   this.http
  //     .post<IPagination<IProduct>>(this.apiUrl, {
  //       pageNumber: pageNumber, // 👈 هنا pageNumber مش pageIndex
  //       pageSize: pageSize,
  //     })
  //     .subscribe({
  //       next: (res) => this.productsPagination.set(res),
  //       error: (err) => console.error(err),
  //       complete: () => this.isLoading.set(false),
  //     });
  // }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(`${this.apiUrl}/brands`);
  }

  getTypes(): Observable<IType[]> {
    return this.http.get<IType[]>(`${this.apiUrl}/types`);
  }
}
