import { OrdersService } from '../../core/services/order.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from '../../core/models/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.html',
  imports: [CommonModule],
})
export class OrderDetailComponent implements OnInit {
  order: IOrder | null = null;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private OrdersService: OrdersService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.OrdersService.getOrderById(id).subscribe({
        next: (res) => (this.order = res),
        error: (err) => (this.errorMessage = 'Failed to load order'),
      });
    }
  }
}
