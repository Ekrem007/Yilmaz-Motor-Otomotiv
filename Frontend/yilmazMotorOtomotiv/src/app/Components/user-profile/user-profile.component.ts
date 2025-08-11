import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { UserService } from '../../Services/user.service';
import { OrderServiceService } from '../../Services/order.service';
import { UserTaskServiceService } from '../../Services/user-task-service.service';
import { CouponService } from '../../Services/coupon.service';
import { UserDto, UpdateUserDto } from '../../Models/userDto';
import { OrderDetailsDto } from '../../Models/OrderDetailsDto';
import { OrderDto } from '../../Models/orderDto';
import { UserTaskStatus } from '../../Models/userTask';
import { TurkishCurrencyPipe } from '../../pipes/turkish-currency.pipe';
import { forkJoin } from 'rxjs';

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
  orderTotals: { [orderId: number]: number } = {}; // Her sipariş için toplam tutarlar
  
  // Pagination özellikleri
  currentPage = 1;
  itemsPerPage = 3;
  totalOrders = 0;
  paginatedOrderKeys: number[] = [];
  
  // Görevler ve kuponlar için eklenen özellikler
  userTasks: UserTaskStatus[] = [];
  isTasksLoading = false;
  tasksErrorMessage = '';
  visibleCouponCodes: { [taskId: number]: boolean } = {};
  couponUsageStatus: { [couponCode: string]: boolean } = {}; // Kuponların kullanım durumu

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private orderService: OrderServiceService,
    private userTaskService: UserTaskServiceService,
    private couponService: CouponService,
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
      } else if (params['tab'] === 'tasks') {
        this.activeTab = 'tasks';
      } else {
        this.activeTab = 'profile-info';
      }
    });

    this.loadUserData();
    this.loadUserOrders();
    this.loadUserTasks();
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

    // Hem sipariş detaylarını hem de tüm siparişleri paralel olarak yükle
    forkJoin({
      details: this.orderService.getOrdersByUserId(this.currentUserId),
      allOrders: this.orderService.getOrders()
    }).subscribe({
      next: (responses) => {
        if (responses.details.success) {
          this.userOrders = responses.details.data || [];
          
          // Sipariş toplam tutarlarını sakla - kullanıcının siparişlerini filtrele
          this.orderTotals = {};
          if (responses.allOrders.success) {
            (responses.allOrders.data || []).forEach((order: OrderDto) => {
              if (order.userId === this.currentUserId) {
                this.orderTotals[order.id] = order.totalAmount;
              }
            });
          }
          
          this.groupOrdersByOrderId();
        } else {
          this.ordersErrorMessage = responses.details.message || 'Siparişler yüklenirken bir hata oluştu.';
        }
        this.isOrdersLoading = false;
      },
      error: (error) => {
        // Eğer allOrders API'si çalışmıyorsa, sadece detayları kullan
        console.warn('AllOrders API failed, falling back to details only:', error);
        this.orderService.getOrdersByUserId(this.currentUserId!).subscribe({
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
    // Önce backend'den gelen asıl sipariş toplam tutarını kullan
    if (this.orderTotals[orderId] !== undefined) {
      return this.orderTotals[orderId];
    }
    
    // Eğer toplam tutar yoksa, ürün bazında hesapla (fallback)
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
  
  // Görevler ve kuponları yükle
  loadUserTasks(): void {
    if (!this.currentUserId) return;
    
    this.isTasksLoading = true;
    this.tasksErrorMessage = '';
    
    this.userTaskService.getUserTaskStatus(this.currentUserId).subscribe({
      next: (response) => {
        if (response.success) {
          this.userTasks = response.data;
          // Tüm görevlerin kupon kodlarını başlangıçta gizle
          this.userTasks.forEach(task => {
            this.visibleCouponCodes[task.taskId] = false;
          });
          
          // Kupon kullanım durumlarını kontrol et
          this.checkCouponUsageStatus();
        } else {
          this.tasksErrorMessage = 'Görev bilgileri alınamadı: ' + response.message;
        }
        this.isTasksLoading = false;
      },
      error: (error) => {
        this.tasksErrorMessage = 'Görev ve kupon bilgileri yüklenirken bir hata oluştu.';
        this.isTasksLoading = false;
        console.error('Görev yükleme hatası:', error);
      }
    });
  }

  // Kupon kullanım durumlarını kontrol et
  private checkCouponUsageStatus(): void {
    const completedTasks = this.userTasks.filter(task => task.isCompleted && task.couponCode);
    
    completedTasks.forEach(task => {
      if (task.couponCode) {
        this.couponService.validateCouponCode(task.couponCode).subscribe({
          next: (response) => {
            if (response.success && response.data) {
              // Kupon bulundu, kullanım durumunu kontrol et
              this.couponUsageStatus[task.couponCode!] = response.data.isUsed;
            } else {
              // Kupon bulunamadı veya hata durumu
              this.couponUsageStatus[task.couponCode!] = false;
            }
          },
          error: (error) => {
            // Hata durumunda kullanılmamış kabul et
            this.couponUsageStatus[task.couponCode!] = false;
          }
        });
      }
    });
  }

  // Kuponun kullanılıp kullanılmadığını kontrol et
  isCouponUsed(couponCode: string | null): boolean {
    if (!couponCode) return false;
    return this.couponUsageStatus[couponCode] || false;
  }
  
  // Kupon kodunun görünürlüğünü değiştir
  toggleCouponCodeVisibility(taskId: number): void {
    this.visibleCouponCodes[taskId] = !this.visibleCouponCodes[taskId];
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
