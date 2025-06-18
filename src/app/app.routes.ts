import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { RepairRequestComponent } from './features/repair-request/repair-request.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'repair-request', component: RepairRequestComponent }, // Nueva ruta
  { path: '**', redirectTo: '' }
];