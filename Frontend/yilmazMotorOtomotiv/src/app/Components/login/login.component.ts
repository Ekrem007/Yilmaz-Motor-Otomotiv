import { Component, OnDestroy } from '@angular/core';
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
export class LoginComponent implements OnDestroy {
  loginData: LoginDto = {
    userName: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private errorTimeout: any;

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
        this.successMessage = response.message || 'Giriş başarılı! Yönlendiriliyorsunuz...';
        
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
        console.log('Login component error:', error); // Debug için
        
        // AuthService'ten gelen hata mesajını kullan
        this.errorMessage = error.message || 'Beklenmeyen bir hata oluştu! Lütfen tekrar deneyin.';
        
        // Formu temizle (güvenlik için)
        this.loginData.password = '';
        
        // Hata mesajını 5 saniye sonra otomatik temizle
        this.errorTimeout = setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
    
    // Timeout'u temizle
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
  }

  ngOnDestroy() {
    // Component destroy edildiğinde timeout'u temizle
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }
}
