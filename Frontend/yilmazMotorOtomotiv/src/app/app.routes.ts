import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import { AdminDashBoardComponent } from './Components/admin-dash-board/admin-dash-board.component';
import { CommunicationComponent } from './Components/communication/communication.component';
import { AboutComponent } from './Components/about/about.component';
import { AuthGuard } from './Guards/auth.guard';
import { ProductAdminPageComponent } from './Components/product-admin-page/product-admin-page.component';
import { CategoryAdminPageComponent } from './Components/category-admin-page/category-admin-page.component';
import { CustomerProductPageComponent } from './Components/customer-product-page/customer-product-page.component';
import { CartComponent } from './Components/cart/cart.component';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';
import { AdminOrdersPageComponent } from './Components/admin-orders-page/admin-orders-page.component';
import { ProductComponent } from './Components/product/product.component';
import { TicketsComponent } from './Components/tickets/tickets.component';
import { CreateTicketComponent } from './Components/create-ticket/create-ticket.component';
import { TicketDetailComponent } from './Components/ticket-detail/ticket-detail.component';
import { AdminTicketsComponent } from './Components/admin-tickets/admin-tickets.component';
import { RegisterComponent } from './Components/register/register.component';
import { DiscountedProductsComponent } from './Components/discounted-products/discounted-products.component';
import { DiscountAdminPageComponent } from './Components/discount-admin-page/discount-admin-page.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'admin', component: AdminDashBoardComponent, canActivate: [AuthGuard] },
  { path: 'communication', component: CommunicationComponent },
  { path: 'products/:categoryId', component: CustomerProductPageComponent },
  { path: 'products', component: CustomerProductPageComponent },
  { path: 'product/:id', component: ProductComponent },
  {path: 'admin/products', component: ProductAdminPageComponent, canActivate: [AuthGuard] },
  {path: 'admin/categories', component: CategoryAdminPageComponent, canActivate: [AuthGuard] },
  {path: 'admin/orders', component: AdminOrdersPageComponent, canActivate: [AuthGuard] },
  {path: 'admin/tickets', component: AdminTicketsComponent, canActivate: [AuthGuard] },
  {path: 'admin/discounts', component: DiscountAdminPageComponent, canActivate: [AuthGuard] },
  {path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  {path: 'cart', component: CartComponent },
  {path: 'tickets', component: TicketsComponent, canActivate: [AuthGuard] },
  {path: 'tickets/create', component: CreateTicketComponent, canActivate: [AuthGuard] },
  {path: 'tickets/:id', component: TicketDetailComponent, canActivate: [AuthGuard] },
  {path: 'discountedProducts', component: DiscountedProductsComponent},
  {path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];
