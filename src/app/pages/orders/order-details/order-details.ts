import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { IOrder } from '../../../core/models/order';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.scss'],
})
export class OrderDetailsComponent implements OnInit {
  order?: IOrder;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe({
        next: (res) => (this.order = res),
        error: (err) => console.error('Error loading order details', err),
      });
    }
  }

  // تحويل حالة الأوردر إلى نسبة Progress Bar
  getProgress(status: string): number {
    switch (status.toLowerCase()) {
      case 'pending':
        return 33;
      case 'out for delivery':
        return 66;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  }

  // إجمالي الأوردر مع التوصيل
  getTotal(): number {
    if (!this.order) return 0;
    return this.order.subtotal + this.order.deliveryCost;
  }
}
