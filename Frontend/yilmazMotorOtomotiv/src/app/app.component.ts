import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './Services/auth.service';
import { CartService } from './Services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'yilmazMotorOtomotiv';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    // Mevcut oturumu kontrol et
    const userId = this.authService.restoreSession();
    
    if (userId) {
      // Eğer geçerli bir oturum varsa kullanıcının sepetini yükle
      this.cartService.loadUserCart(userId);
    } else {
      // Oturum yoksa sadece auth storage'ı temizle (sepet verilerini bırak)
      this.authService.clearStorageOnAppStart();
      this.cartService.clearUserCart(); // Sadece aktif kullanıcı state'ini temizle
    }
    
    // Home page'e yönlendir
    this.router.navigate(['']);
  }
}
