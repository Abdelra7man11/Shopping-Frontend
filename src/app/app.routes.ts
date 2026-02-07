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
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' }, // Default Route
  { path: 'products', component: AllProducts },
  { path: 'products/:id', component: ProductDetails },
  { path: 'baskets', component: BasketComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] }, // Secure checkout route
  { path: 'orders', component: Orders, canActivate: [AuthGuard] }, // Secure orders list route
  { path: 'orders/:id', component: OrderDetailsComponent, canActivate: [AuthGuard], }, // Secure order details route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: Notfound }, // Not Found Route
];
