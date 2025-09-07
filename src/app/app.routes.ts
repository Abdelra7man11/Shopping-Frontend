import { Routes } from '@angular/router';
import { ProductDetails } from './pages/products/product-details/product-details';
import { Basket } from './pages/basket/basket';
import { Checkout } from './pages/checkout/checkout';
import { OrdersComponent } from './pages/orders/orders';
import { AllProducts } from './pages/products/all-products/all-products';
import { RegisterComponent } from './pages/auth/register/register';
import { LoginComponent } from './pages/auth/login/login';
import { Notfound } from './components/notfound/notfound';

// import

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: AllProducts },
  { path: 'products/:id', component: ProductDetails },
  { path: 'basket', component: Basket },
  { path: 'checkout', component: Checkout },
  { path: 'orders', component: OrdersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: Notfound }, // In Error
];
