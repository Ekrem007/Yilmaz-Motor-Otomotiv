import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { UserService } from '../../Services/user.service';
import { OrderServiceService } from '../../Services/order.service';
import { UserDto, UpdateUserDto } from '../../Models/userDto';
import { OrderDetailsDto } from '../../Models/OrderDetailsDto';
import { TurkishCurrencyPipe } from '../../pipes/turkish-currency.pipe';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, ReactiveFormsModule, TurkishCurrencyPipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup;
  currentUser: UserDto | null = null;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentUserId: number | null = null;
  activeTab = 'profile-info'; // Default aktif sekme
  Math = Math; // Template'te Math fonksiyonları kullanabilmek için
  
  // Siparişler için eklenen özellikler
  userOrders: OrderDetailsDto[] = [];
  isOrdersLoading = false;
  ordersErrorMessage = '';
  groupedOrders: { [orderId: number]: OrderDetailsDto[] } = {};
  
  // Pagination özellikleri
  currentPage = 1;
  itemsPerPage = 3;
  totalOrders = 0;
  paginatedOrderKeys: number[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private orderService: OrderServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
    
    if (!this.currentUserId) {
      this.router.navigate(['/login']);
      return;
    }

    // Query parameter kontrolü - hangi sekmenin açılacağını belirle
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['tab'] === 'orders') {
        this.activeTab = 'orders';
      } else {
        this.activeTab = 'profile-info';
      }
    });

    this.loadUserData();
    this.loadUserOrders();
  }

  loadUserData(): void {
    if (!this.currentUserId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUserById(this.currentUserId).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.userForm.patchValue({
          name: user.name,
          surName: user.surName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          address: user.address
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Kullanıcı bilgileri yüklenirken bir hata oluştu.';
        this.isLoading = false;
        console.error('Kullanıcı yükleme hatası:', error);
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.isEditMode && this.currentUser) {
      // Edit mode iptal ediliyorsa, formu sıfırla
      this.userForm.patchValue({
        name: this.currentUser.name,
        surName: this.currentUser.surName,
        email: this.currentUser.email,
        phoneNumber: this.currentUser.phoneNumber,
        address: this.currentUser.address
      });
    }
  }

  onSubmit(): void {
    if (!this.userForm.valid || !this.currentUserId) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData: UpdateUserDto = {
      email: this.userForm.value.email,
      name: this.userForm.value.name,
      surName: this.userForm.value.surName,
      phoneNumber: this.userForm.value.phoneNumber,
      address: this.userForm.value.address
    };

    this.userService.updateUser(this.currentUserId, updateData).subscribe({
      next: (response) => {
        console.log('Update response:', response);
        // Backend string döndürüyorsa, response direkt mesaj olacak
        this.successMessage = typeof response === 'string' ? 'Profil bilgileriniz başarıyla güncellendi.' : response.message || 'Profil bilgileriniz başarıyla güncellendi.';
        this.isEditMode = false;
        this.isLoading = false;
        // Güncel verileri tekrar yükle
        this.loadUserData();
      },
      error: (error) => {
        console.error('Güncelleme hatası:', error);
        
        let errorMsg = 'Profil güncellenirken bir hata oluştu.';
        
        if (error.status === 0) {
          errorMsg = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
        } else if (error.status === 404) {
          errorMsg = 'Kullanıcı bulunamadı.';
        } else if (error.status === 400) {
          errorMsg = 'Gönderilen veriler geçersiz.';
        } else if (error.status === 500) {
          errorMsg = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        } else if (error.error && typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.error && error.error.message) {
          errorMsg = error.error.message;
        }
        
        this.errorMessage = errorMsg;
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return `${this.getFieldDisplayName(fieldName)} zorunludur.`;
    }
    if (field.errors['email']) {
      return 'Geçerli bir e-posta adresi giriniz.';
    }
    if (field.errors['minlength']) {
      return `${this.getFieldDisplayName(fieldName)} en az ${field.errors['minlength'].requiredLength} karakter olmalıdır.`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Ad',
      surName: 'Soyad',
      email: 'E-posta',
      phoneNumber: 'Telefon',
      address: 'Adres'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Kullanıcının siparişlerini yükle
  loadUserOrders(): void {
    if (!this.currentUserId) return;

    this.isOrdersLoading = true;
    this.ordersErrorMessage = '';

    this.orderService.getOrdersByUserId(this.currentUserId).subscribe({
      next: (response) => {
        if (response.success) {
          this.userOrders = response.data || [];
          this.groupOrdersByOrderId();
        } else {
          this.ordersErrorMessage = response.message || 'Siparişler yüklenirken bir hata oluştu.';
        }
        this.isOrdersLoading = false;
      },
      error: (error) => {
        this.ordersErrorMessage = 'Siparişler yüklenirken bir hata oluştu.';
        this.isOrdersLoading = false;
        console.error('Sipariş yükleme hatası:', error);
      }
    });
  }

  // Siparişleri OrderId'ye göre grupla
  private groupOrdersByOrderId(): void {
    this.groupedOrders = {};
    this.userOrders.forEach(order => {
      if (!this.groupedOrders[order.orderId]) {
        this.groupedOrders[order.orderId] = [];
      }
      this.groupedOrders[order.orderId].push(order);
    });
    
    // Pagination'ı güncelle
    this.updatePagination();
  }

  // Sipariş grubu için toplam tutar hesapla
  getOrderTotal(orderId: number): number {
    if (!this.groupedOrders[orderId]) return 0;
    return this.groupedOrders[orderId].reduce((total, item) => total + item.totalAmount, 0);
  }

  // Sipariş durum rengini döndür
  getOrderStatusClass(orderId: number): string {
    if (!this.groupedOrders[orderId] || this.groupedOrders[orderId].length === 0) {
      return 'badge-secondary';
    }
    
    const status = this.groupedOrders[orderId][0].status;
    
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'bekliyor':
        return 'badge-warning';
      case 'confirmed':
      case 'onaylandı':
        return 'badge-info';
      case 'preparing':
      case 'hazırlanıyor':
        return 'badge-primary';
      case 'shipped':
      case 'gönderildi':
        return 'badge-info';
      case 'delivered':
      case 'teslim edildi':
        return 'badge-success';
      case 'cancelled':
      case 'iptal edildi':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  // Sipariş durumunu Türkçe olarak döndür
  getOrderStatusText(orderId: number): string {
    if (!this.groupedOrders[orderId] || this.groupedOrders[orderId].length === 0) {
      return 'Bilinmiyor';
    }
    
    const status = this.groupedOrders[orderId][0].status;
    
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Bekliyor';
      case 'confirmed':
        return 'Onaylandı';
      case 'preparing':
        return 'Hazırlanıyor';
      case 'shipped':
        return 'Gönderildi';
      case 'delivered':
        return 'Teslim Edildi';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status || 'Bilinmiyor';
    }
  }

  // Gruplandırılmış siparişlerin key'lerini döndür
  getOrderKeys(): number[] {
    return Object.keys(this.groupedOrders).map(key => parseInt(key));
  }

  // Sipariş tarihini formatla ve döndür
  getOrderDate(orderId: number): string {
    if (!this.groupedOrders[orderId] || this.groupedOrders[orderId].length === 0) {
      return 'Tarih bilinmiyor';
    }
    
    const orderDate = this.groupedOrders[orderId][0].orderDate;
    if (!orderDate) {
      return 'Tarih bilinmiyor';
    }
    
    try {
      const date = new Date(orderDate);
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Tarih bilinmiyor';
    }
  }

  // Tarih formatını döndür (eski fonksiyon - artık kullanılmıyor)
  getCurrentDate(): string {
    return new Date().toLocaleDateString('tr-TR');
  }

  // Sekme değiştirme fonksiyonu
  switchTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // Pagination'ı güncelle
  private updatePagination(): void {
    const allOrderKeys = Object.keys(this.groupedOrders).map(key => parseInt(key));
    this.totalOrders = allOrderKeys.length;
    
    // Mevcut sayfaya göre siparişleri filtrele
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrderKeys = allOrderKeys.slice(startIndex, endIndex);
  }

  // Sayfa değiştir
  changePage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // Toplam sayfa sayısını hesapla
  getTotalPages(): number {
    return Math.ceil(this.totalOrders / this.itemsPerPage);
  }

  // Sayfa numaralarını oluştur
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Önceki sayfa kontrolü
  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  // Sonraki sayfa kontrolü
  hasNextPage(): boolean {
    return this.currentPage < this.getTotalPages();
  }

  // Sayfalandırılmış sipariş key'lerini döndür (HTML'de kullanılacak)
  getPaginatedOrderKeys(): number[] {
    return this.paginatedOrderKeys;
  }
}
