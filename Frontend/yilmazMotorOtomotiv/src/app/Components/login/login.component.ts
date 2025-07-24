import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CartService } from '../../Services/cart.service';
import { LoginDto } from '../../Models/loginDto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData: LoginDto = {
    userName: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.loginData.userName || !this.loginData.password) {
      this.errorMessage = 'Lütfen kullanıcı adı ve şifre giriniz!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        
        // Kullanıcı sepetini yükle
        this.cartService.loadUserCart(response.userId);
        
        // Rol tabanlı yönlendirme
        setTimeout(() => {
          if (response.roleId === 1) {
            // Admin girişi - Ana sayfaya yönlendir
            this.router.navigate(['/']);
          } else if (response.roleId === 2) {
            // User girişi - Ana sayfaya yönlendir
            this.router.navigate(['/']);
          } else {
            // Varsayılan olarak ana sayfaya yönlendir
            this.router.navigate(['/']);
          }
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Giriş yapılırken bir hata oluştu!';
      }
    });
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
