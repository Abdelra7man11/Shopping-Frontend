import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { BasketService } from '../../../core/services/basket.service';
import { Spinner } from '../../../components/spinner/spinner';
import { IProduct } from '../../../core/models/product';
import { IBasket } from '../../../core/models/basket';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, Spinner],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.scss'],
})
export class ProductDetails implements OnInit {
  id: number | null = null;
  data: IProduct | null = null;
  isLoading = false;

  basket?: IBasket;
  basketKey = '';
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private basketService = inject(BasketService);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const productId = Number(idParam);

    if (!isNaN(productId)) {
      this.getProduct(productId);
    } else {
      console.error('Invalid product id:', idParam);
    }

    // استرجاع السلة الحالية إذا موجودة
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

  // 🔹 إضافة المنتج للسلة مباشرة
  addToBasket(quantity: number = 1) {
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
      item.quantity += quantity;
    } else {
      this.basket.items.push({
        id: this.data.id,
        productName: this.data.name,
        price: this.data.price,
        quantity,
        pictureUrl: this.data.pictureUrl,
      });
    }

    this.basketService.createOrUpdateBasket(this.basket).subscribe({
      next: (res) => {
        this.basket = res;
        this.location.back();
      },

      error: (err) => console.error('❌ Error saving basket', err),
    });
  }
}
