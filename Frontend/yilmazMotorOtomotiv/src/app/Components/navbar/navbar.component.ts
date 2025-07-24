import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CategoryService } from '../../Services/category.service';
import { CartService } from '../../Services/cart.service';
import { Category } from '../../Models/category';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser: string = '';
  categories: Category[] = [];
  isAdmin = false;
  isUser = false;
  cartItemCount = 0;

  constructor(
    private authService: AuthService, 
    private categoryService: CategoryService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Kullanıcı bilgilerini dinle
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = this.authService.isLoggedIn();
      this.currentUser = user || '';
    });
    
    // Kullanıcı rolünü dinle
    this.authService.userRole$.subscribe(role => {
      this.isAdmin = this.authService.isAdmin();
      this.isUser = this.authService.isUser();
    });
    
    // Sepet değişikliklerini dinle
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = this.cartService.getTotalItems();
    });
    
    this.getCategories();
  }

  logout() {
    this.cartService.clearUserCart(); // Sadece aktif kullanıcıyı temizle (sepet verilerini localStorage'da bırak)
    this.authService.logout(); // Kullanıcı çıkışı yap
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
}
