import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Spinner } from '../../../components/spinner/spinner';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule, Spinner],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  id: any;
  data: any = {};
  isLoading = false; // Variable Loading
  constructor(
    private route: ActivatedRoute,
    private _service: ProductService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getProduct();
  }
  getProduct() {
    this.isLoading = true; // Start Loading
    this._service.getProductById(this.id).subscribe({
      next: (res) => {
        this.data = res;
        this.isLoading = false; // Stop Loading
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false; // Stop Loading in Error
      },
    });
  }
}
