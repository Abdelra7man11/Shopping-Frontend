import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IBasket, IBasketItem } from '../../core/models/basket';
import { BasketService } from '../../core/services/basket.service';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-basket',
  imports: [CommonModule, RouterLink],
  templateUrl: './basket.html',
  styleUrl: './basket.scss',
})
export class BasketComponent implements OnInit {
  basket?: IBasket;
  basketKey = '';

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.basketKey = localStorage.getItem('basket_id') ?? '';
    if (this.basketKey) {
      this.loadBasket();
    }
  }

  // 🟢 تحميل الباسكت من الـ API
  loadBasket() {
    this.basketService.getBasket(this.basketKey).subscribe({
      next: (res) => (this.basket = res),
      error: (err) => console.error('Error loading basket', err),
    });
  }

  // 🟢 حفظ الباسكت بعد أي تعديل
  saveBasket() {
    if (!this.basket) return;
    this.basketService.createOrUpdateBasket(this.basket).subscribe({
      next: (res) => (this.basket = res),
      error: (err) => console.error('Error saving basket', err),
    });
  }

  // 🟢 زيادة كمية منتج
  incrementQuantity(item: IBasketItem) {
    item.quantity++;
    this.saveBasket();
  }

  // 🟢 تقليل كمية منتج
  decrementQuantity(item: IBasketItem) {
    if (item.quantity > 1) {
      item.quantity--;
      this.saveBasket();
    }
  }

  // 🟢 حذف منتج من الباسكت
  removeItem(item: IBasketItem) {
    if (!this.basket) return;
    this.basket.items = this.basket.items.filter((x) => x.id !== item.id);
    this.saveBasket();
  }

  // 🟢 حساب Subtotal
  getSubtotal(): number {
    return (
      this.basket?.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ) ?? 0
    );
  }

  // 🟢 حساب Total (مع الشحن لو موجود)
  getTotal(): number {
    return this.getSubtotal() + (this.basket?.shippingPrice ?? 0);
  }

  // 🟢 Checkout (هنوصله بالـ OrderService بعدين)
  checkout() {
    console.log('Proceeding to checkout...', this.basket);
    // هنا بعدين هتستعمل OrderService وتبعت:
    // {
    //   basketId: this.basket?.id,
    //   deliveryMethodId: 1,
    //   shipToAddress: { ... }
    // }
  }
}
