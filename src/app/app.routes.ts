import { Routes } from '@angular/router';
import { ProductDetails } from './pages/products/product-details/product-details';
import { AllProducts } from './pages/products/all-products/all-products';
import { CheckoutComponent } from './pages/checkout/checkout';
import { RegisterComponent } from './pages/auth/register/register';
import { LoginComponent } from './pages/auth/login/login';
import { Notfound } from './components/notfound/notfound';
import { BasketComponent } from './pages/basket/basket';
import { Orders } from './pages/orders/order-list/orders';
import { OrderDetailsComponent } from './pages/orders/order-details/order-details';

import { AuthGuard } from './core/guards/auth.guard'; // تأكد المسار صحيح

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: AllProducts },
  { path: 'products/:id', component: ProductDetails },
  { path: 'baskets', component: BasketComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] }, // محمية
  { path: 'orders', component: Orders, canActivate: [AuthGuard] }, // محمية
  {
    path: 'orders/:id',
    component: OrderDetailsComponent,
    canActivate: [AuthGuard],
  }, // محمية
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: Notfound }, // صفحة خطأ
];
