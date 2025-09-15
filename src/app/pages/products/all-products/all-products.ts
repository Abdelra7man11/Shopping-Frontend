import {
  Component,
  OnInit,
  computed,
  signal,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Spinner } from '../../../components/spinner/spinner';
import { ProductItem } from '../product-item/product-item';
import { ProductService } from '../../../core/services/product.service';
import { BasketService } from '../../../core/services/basket.service';
import { IProduct } from '../../../core/models/product';
import { IBrand } from '../../../core/models/productBrand';
import { IType } from '../../../core/models/productType';
import { IBasket } from '../../../core/models/basket';

interface IToast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, FormsModule, Spinner, ProductItem],
  templateUrl: './all-products.html',
  styleUrls: ['./all-products.scss'],
})
export class AllProducts implements OnInit {
  private productService = inject(ProductService);
  private basketService = inject(BasketService);

  selectedBrand = signal<number | ''>('');
  selectedType = signal<number | ''>('');
  brands = signal<IBrand[]>([]);
  types = signal<IType[]>([]);
  basket = signal<IBasket | null>(null);
  toasts = signal<IToast[]>([]);

  pageNumber = 1;
  pageSize = 10;

  products = computed(() => this.productService.productsPagination().data);

  constructor() {
    effect(() => {
      const pagination = this.productService.productsPagination();
      console.log('Current page:', pagination.pageNumber);
      console.log('Total items:', pagination.count);
    });
  }

  ngOnInit(): void {
    this.getBrands();
    this.getTypes();
    this.getProducts(this.pageNumber);

    const basketKey = localStorage.getItem('basket_id');
    if (basketKey) {
      this.basketService.getBasket(basketKey).subscribe({
        next: (res) => this.basket.set(res),
        error: (err) => console.error('Error loading basket ❌', err),
      });
    }
  }

  getProducts(pageNumber: number = 1) {
    this.pageNumber = pageNumber;

    const params: any = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };

    if (this.selectedBrand() !== '') params.brandId = this.selectedBrand();
    if (this.selectedType() !== '') params.typeId = this.selectedType();

    this.productService.getAllProducts(params);
  }

  get totalPages() {
    return Math.ceil(
      this.productService.productsPagination().count / this.pageSize
    );
  }

  getBrands() {
    this.productService.getBrands().subscribe({
      next: (res) => this.brands.set(res),
      error: (err) => console.error(err),
    });
  }

  getTypes() {
    this.productService.getTypes().subscribe({
      next: (res) => this.types.set(res),
      error: (err) => console.error(err),
    });
  }

  onBrandSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedBrand.set(value ? parseInt(value) : '');
    this.getProducts(1);
  }

  onTypeSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedType.set(value ? parseInt(value) : '');
    this.getProducts(1);
  }

  trackById(index: number, item: IProduct) {
    return item.id;
  }

  get isLoading() {
    return this.productService.isLoading();
  }

  addToBasket(product: IProduct, quantity: number = 1) {
    if (!this.basket()) {
      const basketKey = crypto.randomUUID();
      localStorage.setItem('basket_id', basketKey);
      this.basket.set({
        id: basketKey,
        items: [],
        clientSecret: null,
        paymentIntentId: null,
        deliveryMethodId: null,
        shippingPrice: null,
      });
    }

    const currentBasket = this.basket();
    if (!currentBasket) return;

    const existingItem = currentBasket.items.find((x) => x.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentBasket.items.push({
        id: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        pictureUrl: product.pictureUrl,
      });
    }

    this.basketService.createOrUpdateBasket(currentBasket).subscribe({
      next: (res) => {
        this.basket.set(res);
        this.showToast(
          `Product: ${product.name} Quantity: (${quantity}) added to basket!`
        );
      },
      error: (err) => console.error('❌ Error saving basket', err),
    });
  }

  showToast(message: string) {
    const id = crypto.randomUUID();
    this.toasts.update((prev) => [...prev, { id, message }]);
    setTimeout(() => this.removeToast(id), 3000);
  }

  removeToast(id: string) {
    this.toasts.update((prev) => prev.filter((t) => t.id !== id));
  }
}
