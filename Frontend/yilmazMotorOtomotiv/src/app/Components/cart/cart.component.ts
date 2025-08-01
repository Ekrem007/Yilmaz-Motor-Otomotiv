import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService, CartItem } from '../../Services/cart.service';
import { TurkishCurrencyPipe } from '../../pipes/turkish-currency.pipe';
import { OrderServiceService } from '../../Services/order.service';
import { AuthService } from '../../Services/auth.service';
import { CreateOrderDto } from '../../Models/createOrderDto';
import { CreateOrderItemDto } from '../../Models/createOrderItemDto';
import { OrderItemDto } from '../../Models/OrderItemDto';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule, TurkishCurrencyPipe, ReactiveFormsModule, HttpClientModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalItems: number = 0;
  paymentForm!: FormGroup;
  isProcessing: boolean = false;

  // Modern Angular inject() function kullanarak service'leri inject edelim
  private cartService = inject(CartService);
  private formBuilder = inject(FormBuilder);
  private orderService = inject(OrderServiceService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private userService = inject(UserService);

  constructor() {
    this.initializePaymentForm();
  }

  ngOnInit(): void {
    // Session'ı kontrol et
    this.authService.restoreSession();
    
    this.loadCartData();
    
    // Cart değişikliklerini dinle
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
      this.totalItems = this.cartService.getTotalItems();
    });
  }

  loadCartData() {
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
    this.totalItems = this.cartService.getTotalItems();
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    if (confirm('Sepeti temizlemek istediğinizden emin misiniz?')) {
      this.cartService.clearCart();
    }
  }

  increaseQuantity(productId: number) {
    const currentQuantity = this.cartService.getProductQuantity(productId);
    this.updateQuantity(productId, currentQuantity + 1);
  }

  decreaseQuantity(productId: number) {
    const currentQuantity = this.cartService.getProductQuantity(productId);
    if (currentQuantity > 1) {
      this.updateQuantity(productId, currentQuantity - 1);
    }
  }

  // Type guard to check if product has categoryName property
  hasCategory(product: any): product is { categoryName: string } {
    return 'categoryName' in product;
  }

  // Kullanıcının giriş yapıp yapmadığını kontrol et
  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  initializePaymentForm() {
    this.paymentForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required]],
      cardHolder: ['', [Validators.required, Validators.minLength(2)]],
      expiryDate: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  openPaymentModal() {
    if (this.cartItems.length === 0) {
      this.toastr.warning('Sepetinizde ürün bulunmuyor!', 'Sepet Boş');
      return;
    }

    // Kullanıcı girişi kontrolü
    if (!this.authService.isLoggedIn()) {
      this.toastr.info('Sipariş vermek için giriş yapmanız gerekiyor!', 'Giriş Gerekli');
      return;
    }

    // Kullanıcı bilgilerini al ve formu doldur
    this.loadUserDataToForm();

    // Bootstrap modal açma
    const modal = document.getElementById('paymentModal');
    if (modal) {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap) {
        const paymentModal = new bootstrap.Modal(modal);
        paymentModal.show();
      }
    }
  }

  // Kullanıcı bilgilerini alıp formu otomatik doldur
  private loadUserDataToForm() {
    const userId = this.authService.getUserId();
    
    if (userId && this.userService) {
      this.userService.getUserById(userId).subscribe({
        next: (userData) => {
          // Kullanıcı bilgilerini form alanlarına otomatik doldur
          this.paymentForm.patchValue({
            firstName: userData.name,
            lastName: userData.surName,
            email: userData.email,
            phone: userData.phoneNumber,
            address: userData.address
          });
          
          this.toastr.success('Fatura bilgileri otomatik dolduruldu!', 'Bilgi');
        },
        error: (error) => {
          this.toastr.warning('Kullanıcı bilgileri alınamadı, lütfen manuel olarak doldurun.', 'Bilgi');
        }
      });
    } else {
      if (!this.userService) {
        this.toastr.warning('Kullanıcı servisi yüklenemedi, lütfen manuel olarak doldurun.', 'Bilgi');
      }
      if (!userId) {
        this.toastr.warning('Kullanıcı ID bulunamadı, lütfen giriş yapın.', 'Bilgi');
      }
    }
  }

  processPayment() {
    if (!this.paymentForm.valid || this.isProcessing) {
      // Form geçersizse, tüm alanları dokunulmuş olarak işaretle
      Object.keys(this.paymentForm.controls).forEach(key => {
        this.paymentForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isProcessing = true;
    
    // Kullanıcı girişi kontrolü
    const userId = this.authService.getUserId();
    if (!userId) {
      this.toastr.warning('Sipariş vermek için giriş yapmanız gerekiyor!', 'Giriş Gerekli');
      this.isProcessing = false;
      return;
    }

    // Backend işlemi
    this.processRealPayment(userId);
  }

  private processRealPayment(userId: number) {
    // 2 saniye işleniyor gösterimi
    setTimeout(() => {
      // Sipariş verisini hazırla
      const orderItems: CreateOrderItemDto[] = this.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const orderData: CreateOrderDto = {
        userId: userId,
        totalAmount: this.totalPrice,
        orderItems: orderItems
      };

      this.handleBackendOrder(orderData);
    }, 2000); // 2 saniye bekle
  }

  private handleBackendOrder(orderData: CreateOrderDto) {
    // Siparişi backend'e gönder
    this.orderService.addOrder(orderData).subscribe({
      next: (response) => {
        console.log('Backend response:', response);
        try {
          if (response && typeof response === 'object' && 'success' in response && response.success === true) {
            this.toastr.success('Siparişiniz başarıyla oluşturuldu! Sipariş numaranız ile takip edebilirsiniz.', 'Sipariş Başarılı', {
              timeOut: 5000,
              progressBar: true,
              closeButton: true
            });
            this.completeOrder();
          } else {
            const errorMessage = (response && typeof response === 'object' && 'message' in response) ? response.message : 'Bilinmeyen hata';
            this.toastr.error('Sipariş oluşturulurken bir hata oluştu: ' + errorMessage, 'Sipariş Hatası');
            this.isProcessing = false;
          }
        } catch (error) {
          console.error('Response processing error:', error);
          this.toastr.error('Yanıt işlenirken hata oluştu', 'Sistem Hatası');
          this.isProcessing = false;
        }
      },
      error: (error) => {
        console.error('Sipariş hatası:', error);
        this.toastr.error('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.', 'Sistem Hatası');
        this.isProcessing = false;
      }
    });

    // Timeout koruması
    setTimeout(() => {
      if (this.isProcessing) {
        console.log('Timeout - işlem çok uzun sürdü');
        this.toastr.error('İşlem çok uzun sürdü. Lütfen tekrar deneyiniz.', 'Zaman Aşımı');
        this.isProcessing = false;
      }
    }, 10000);
  }

  private completeOrder() {
    // Sepeti temizle
    this.cartService.clearCart();
    
    // Modalı kapat
    const modal = document.getElementById('paymentModal');
    if (modal) {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap) {
        const paymentModal = bootstrap.Modal.getInstance(modal);
        if (paymentModal) {
          paymentModal.hide();
        }
      }
    }
    
    // Formu sıfırla
    this.paymentForm.reset();
    this.isProcessing = false;
  }

  // Kart numarası formatı için
  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      event.target.value = parts.join(' ');
    } else {
      event.target.value = value;
    }
  }

  // Son kullanma tarihi formatı için
  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
  }
}


