// checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IBasket } from '../../core/models/basket';
import { OrderService } from '../../core/services/order.service';
import { BasketService } from '../../core/services/basket.service';
import { IOrderToCreate } from '../../core/models/order';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss'],
})
export class CheckoutComponent implements OnInit {
  basket?: IBasket;
  address = { firstName: '', lastName: '', street: '', city: '', country: '' };
  deliveryMethodId?: number;
  deliveryMethods: any[] = [];

  constructor(
    private orderService: OrderService,
    private basketService: BasketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this.basketService
        .getBasket(basketId)
        .subscribe((res) => (this.basket = res));
    }
    this.orderService
      .getDeliveryMethods()
      .subscribe((res) => (this.deliveryMethods = res));
  }

  changeDeliveryMethod() {
    console.log(this.deliveryMethodId);
    let method = this.deliveryMethods.find(
      (a) => a.id == this.deliveryMethodId
    );
    console.log(method);
  }

  getSubtotal(): number {
    let deliveryCharge = 0;
    if (this.deliveryMethodId) {
      let method = this.deliveryMethods.find(
        (a) => a.id == this.deliveryMethodId
      );
      if (method) {
        deliveryCharge = method.price;
      }
    }
    return (
      (this.basket?.items.reduce((sum, x) => sum + x.price * x.quantity, 0) ??
        0) + deliveryCharge
    );
  }

  getTotal(): number {
    const deliveryCost =
      this.deliveryMethods.find((dm) => dm.id === this.deliveryMethodId)
        ?.price ?? 0;
    return this.getSubtotal() + deliveryCost;
  }

  placeOrder() {
    if (!this.basket || !this.deliveryMethodId) return;

    const order: IOrderToCreate = {
      basketId: this.basket.id,
      deliveryMethodId: this.deliveryMethodId,
      shipToAddress: this.address,
    };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        alert('✅ Order placed successfully');
        localStorage.removeItem('basket_id');
        this.router.navigateByUrl('/orders');
      },
      error: (err) => console.error('❌ Error placing order', err),
    });
  }
}
