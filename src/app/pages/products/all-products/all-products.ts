import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { BasketService } from '../../../core/services/basket.service';
import { Spinner } from '../../../components/spinner/spinner';
import { ProductItem } from '../product-item/product-item';
import { IProduct } from '../../../core/models/product';
import { IBrand } from '../../../core/models/productBrand';
import { IType } from '../../../core/models/productType';
import { IBasket } from '../../../core/models/basket';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, FormsModule, Spinner, ProductItem],
  templateUrl: './all-products.html',
  styleUrls: ['./all-products.scss'],
})
export class AllProducts implements OnInit {
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];

  brands: IBrand[] = [];
  types: IType[] = [];

  selectedBrand: string = '';
  selectedType: string = '';

  basket?: IBasket;
  basketKey = '';
  loadingCount = 0;

  constructor(
    private productService: ProductService,
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();

    this.basketKey = localStorage.getItem('basket_id') ?? '';
    if (this.basketKey) {
      this.basketService.getBasket(this.basketKey).subscribe({
        next: (res) => (this.basket = res),
        error: (err) => console.error('Error loading basket ❌', err),
      });
    }
  }

  get isLoading(): boolean {
    return this.loadingCount > 0;
  }

  private startLoading() {
    this.loadingCount++;
  }

  private stopLoading() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
  }

  getProducts() {
    this.startLoading();
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res.Data;
        this.filteredProducts = res.Data; // initialize filteredProducts
        this.stopLoading();
      },
      error: (err) => {
        console.error(err);
        this.stopLoading();
      },
    });
  }

  getBrands() {
    this.productService.getBrands().subscribe({
      next: (res: IBrand[]) => (this.brands = res),
      error: (err) => console.error(err),
    });
  }

  getTypes() {
    this.productService.getTypes().subscribe({
      next: (res: IType[]) => (this.types = res),
      error: (err) => console.error(err),
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((p) => {
      const matchBrand = this.selectedBrand
        ? p.productBrand === this.selectedBrand
        : true;
      const matchType = this.selectedType
        ? p.productType === this.selectedType
        : true;
      return matchBrand && matchType;
    });
  }

  onBrandSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedBrand = value;
    this.filterProducts();
  }

  onTypeSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedType = value;
    this.filterProducts();
  }

  trackById(index: number, item: IProduct) {
    return item.id;
  }

  // 🔹 إضافة المنتج للسلة
  addToBasket(product: IProduct, quantity: number = 1) {
    if (!this.basket) {
      this.basketKey = crypto.randomUUID();
      localStorage.setItem('basket_id', this.basketKey);
      this.basket = {
        id: this.basketKey,
        items: [],
        clientSecret: null,
        paymentIntentId: null,
        deliveryMethodId: null,
        shippingPrice: null,
      };
    }

    const item = this.basket.items.find((x) => x.id === product.id);
    if (item) {
      item.quantity += quantity;
    } else {
      this.basket.items.push({
        id: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        pictureUrl: product.pictureUrl,
      });
    }

    this.basketService.createOrUpdateBasket(this.basket).subscribe({
      next: (res) => (this.basket = res),
      error: (err) => console.error('❌ Error saving basket', err),
    });
  }
}
