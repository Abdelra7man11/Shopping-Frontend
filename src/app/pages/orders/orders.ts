import { Component, OnInit } from '@angular/core';
import { IDeliveryMethod } from '../../core/models/deliveryMethod';
import { IOrder } from '../../core/models/order';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class OrdersComponent implements OnInit {
  orders: IOrder[] = [];
  errorMessage = '';

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getAllOrders().subscribe({
      next: (res) => (this.orders = res),
      error: (err) => {
        console.error(err);
        if (err.status === 401) {
          this.errorMessage = 'Unauthorized! Please login.';
        } else {
          this.errorMessage = 'Failed to load orders.';
        }
      },
    });
  }
}
