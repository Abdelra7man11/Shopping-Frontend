import { IAddress } from './../../core/models/address';
import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../core/services/order.service';
import { IDeliveryMethod } from '../../core/models/deliveryMethod';
import { IOrderToCreate } from '../../core/models/order';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  deliveryMethods: IDeliveryMethod[] = [];
  selectedDeliveryId: number | null = null;
  basketId = ''; // افترض إنك هتجيبها من service الباسكت
  shipToAddress!: IAddress;
  errorMessage = '';

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.ordersService.getDeliveryMethods().subscribe({
      next: (res) => (this.deliveryMethods = res),
      error: () => (this.errorMessage = 'Failed to load delivery methods'),
    });
  }

  createOrder(): void {
    if (!this.selectedDeliveryId) return;

    const order: IOrderToCreate = {
      basketId: this.basketId,
      deliveryMethodId: this.selectedDeliveryId,
      shipToAddress: this.shipToAddress,
    };

    this.ordersService.createOrder(order).subscribe({
      next: (res) => console.log('Order created:', res),
      error: (err) => (this.errorMessage = 'Failed to create order'),
    });
  }
}
