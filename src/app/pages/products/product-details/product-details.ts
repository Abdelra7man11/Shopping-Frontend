import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { BasketService } from '../../../core/services/basket.service';
import { Spinner } from '../../../components/spinner/spinner';
import { IProduct } from '../../../core/models/product';
import { IBasket } from '../../../core/models/basket';
import { Location } from '@angular/common';

interface IToast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, Spinner, FormsModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.scss'],
})
export class ProductDetails implements OnInit {
  id: number | null = null;
  data: IProduct | null = null;
  isLoading = false;

  basket?: IBasket;
  basketKey = '';
  amount = 1;

  // أزرار + / - تأثير الضغط
  isIncrementActive = false;
  isDecrementActive = false;

  // Toast
  toasts = signal<IToast[]>([]);

  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private basketService = inject(BasketService);

  // ================== Toast functions ==================
  showToast(message: string) {
    const id = crypto.randomUUID();
    this.toasts.update((prev) => [...prev, { id, message }]);
    setTimeout(() => this.removeToast(id), 3000);
  }

  removeToast(id: string) {
    this.toasts.update((prev) => prev.filter((t) => t.id !== id));
  }

  // ================== Lifecycle ==================
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const productId = Number(idParam);

    if (!isNaN(productId)) {
      this.getProduct(productId);
    } else {
      console.error('Invalid product id:', idParam);
    }

    this.basketKey = localStorage.getItem('basket_id') ?? '';
    if (this.basketKey) {
      this.basketService.getBasket(this.basketKey).subscribe({
        next: (res) => (this.basket = res),
        error: (err) => console.error('Error loading basket ❌', err),
      });
    }
  }

  getProduct(productId: number) {
    this.isLoading = true;
    this.productService.getProductById(productId).subscribe({
      next: (res) => {
        this.data = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.isLoading = false;
      },
    });
  }

  increment() {
    this.amount++;
  }

  decrement() {
    if (this.amount > 1) this.amount--;
  }

  // ================== Add to Basket ==================
  addToBasket() {
    if (!this.data) return;

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

    const item = this.basket.items.find((x) => x.id === this.data!.id);
    if (item) {
      item.quantity += this.amount;
    } else {
      this.basket.items.push({
        id: this.data.id,
        productName: this.data.name,
        price: this.data.price,
        quantity: this.amount,
        pictureUrl: this.data.pictureUrl,
      });
    }

    this.basketService.createOrUpdateBasket(this.basket).subscribe({
      next: (res) => {
        this.basket = res;

        // عرض Toast
        this.showToast(
          `${this.data!.name} (${this.amount} pcs) added to basket for ${
            this.data!.price * this.amount
          } L.E!`
        );

        this.amount = 1; // إعادة تعيين الكمية

        // العودة للصفحة السابقة بعد ثانيتين
        window.setTimeout(() => {
          this.location.back();
        }, 1000);
      },
      error: (err) => console.error('❌ Error saving basket', err),
    });
  }
}
