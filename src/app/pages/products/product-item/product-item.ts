import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProduct } from '../../../core/models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-item.html',
  styleUrls: ['./product-item.scss'],
})
export class ProductItem {
  @Input() product!: IProduct;

  // ✅ النوع الصحيح للـ EventEmitter
  @Output() addToBasketEvent = new EventEmitter<{
    product: IProduct;
    quantity: number;
  }>();

  addButton = false; // false = default state
  amount = 1;

  // عرض حقل إدخال الكمية عند الضغط على زر Add To Cart
  showQuantityInput() {
    this.addButton = true;
  }

  // إلغاء إضافة المنتج وإرجاع الحقل للوضع الافتراضي
  cancelAdd() {
    this.addButton = false;
    this.amount = 1;
  }

  // تأكيد إضافة المنتج وإرسال الحدث للـ Parent
  confirmAdd() {
    if (this.amount < 1) this.amount = 1;

    // ✅ إرسال object مطابق للـ EventEmitter
    this.addToBasketEvent.emit({
      product: this.product,
      quantity: this.amount,
    });

    // إعادة الحقل للوضع الافتراضي
    this.addButton = false;
    this.amount = 1;
  }
}
