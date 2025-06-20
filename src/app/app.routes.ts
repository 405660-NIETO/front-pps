import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { RepairRequestComponent } from './features/repair-request/repair-request.component';
import { AdminGuard } from './auth/guards/admin.guard';
import { LoginComponent } from './auth/login/login.component';
import { TestAdminComponent } from './admin/test-admin/test-admin.component';
import { TestEmployeeComponent } from './admin/test-admin/test-employee.component';
import { EmployeeGuard } from './auth/guards/employee.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'repair-request', component: RepairRequestComponent },

  { path: 'login', component: LoginComponent },
  { path: 'admin/test', component: TestAdminComponent, canActivate: [AdminGuard] },
  { path: 'admin/employee-test', component: TestEmployeeComponent, canActivate: [EmployeeGuard] },

  { path: '**', redirectTo: '' }
];