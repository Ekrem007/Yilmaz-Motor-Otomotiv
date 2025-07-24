import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderServiceService } from '../../Services/order.service';
import { OrderDto } from '../../Models/orderDto';
import { OrderDetailDto } from '../../Models/orderDetailDto';
import { OrderStatus } from '../../Models/orderStatus';

@Component({
  selector: 'app-admin-orders-page',
  imports: [CommonModule],
  templateUrl: './admin-orders-page.component.html',
  styleUrl: './admin-orders-page.component.css'
})
export class AdminOrdersPageComponent implements OnInit {
  orders: OrderDto[] = [];
  orderDetails: { [key: number]: OrderDetailDto[] } = {}; // orderId -> orderDetails mapping
  loading: boolean = false;
  error: string = '';
  expandedOrderId: number | null = null;
  loadingDetails: { [key: number]: boolean } = {}; // orderId -> loading state

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(
    private orderService: OrderServiceService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';
    
    this.orderService.getOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.orders = response.data;
          this.calculateTotalPages();
        } else {
          this.error = response.message || 'Siparişler yüklenirken bir hata oluştu.';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Siparişler yüklenirken bir hata oluştu.';
        this.loading = false;
        console.error('Order loading error:', error);
      }
    });
  }

  toggleOrderDetails(orderId: number): void {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
    } else {
      this.expandedOrderId = orderId;
      if (!this.orderDetails[orderId]) {
        this.loadOrderDetails(orderId);
      }
    }
  }

  loadOrderDetails(orderId: number): void {
    this.loadingDetails[orderId] = true;
    
    this.orderService.getOrderDetailByOrderId(orderId).subscribe({
      next: (response) => {
        if (response.success) {
          this.orderDetails[orderId] = response.data;
        } else {
          console.error('Order details loading error:', response.message);
        }
        this.loadingDetails[orderId] = false;
      },
      error: (error) => {
        console.error('Order details loading error:', error);
        this.loadingDetails[orderId] = false;
      }
    });
  }

  isLoadingDetails(orderId: number): boolean {
    return this.loadingDetails[orderId] || false;
  }

  getOrderDetails(orderId: number): OrderDetailDto[] {
    return this.orderDetails[orderId] || [];
  }

  getUserName(orderId: number): string {
    const details = this.orderDetails[orderId];
    return details && details.length > 0 ? details[0].userName : '';
  }

 changeOrderStatus(orderId: number, newStatus: string): void {
  this.orderService.changeOrderStatus(orderId, newStatus).subscribe({
    next: (response) => {
      if (response.success) {
        // Başarılı güncelleme - local state'i güncelle
        const orderIndex = this.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          this.orders[orderIndex].status = newStatus;
        }
        this.toastrService.success('Sipariş durumu başarıyla güncellendi!');
      } else {
        this.toastrService.error('Hata: ' + response.message);
      }
    },
    error: (error) => {
      console.error('Status change error:', error);
      this.toastrService.error('Sipariş durumu güncellenirken bir hata oluştu.');
    }
  });
}


  onStatusChange(orderId: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    this.changeOrderStatus(orderId, newStatus);
  }

  getAvailableStatuses(): { value: string, label: string }[] {
    return [
      { value: OrderStatus.Pending, label: 'Beklemede' },
      { value: OrderStatus.Shipped, label: 'Gönderildi' },
      { value: OrderStatus.Cancelled, label: 'İptal Edildi' }
    ];
  }

  trackByOrderId(index: number, order: OrderDto): number {
    return order.id;
  }

  getPendingOrdersCount(): number {
    return this.orders.filter(order => order.status === 'Pending').length;
  }

  getShippedOrdersCount(): number {
    return this.orders.filter(order => order.status === 'Shipped').length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'status-pending';
      case OrderStatus.Shipped:
        return 'status-shipped';
      case OrderStatus.Cancelled:
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'Beklemede';
      case OrderStatus.Shipped:
        return 'Gönderildi';
      case OrderStatus.Cancelled:
        return 'İptal Edildi';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  }

  // Pagination Methods
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  getPaginatedOrders(): OrderDto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.orders.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.expandedOrderId = null; // Sayfa değiştiğinde detayları kapat
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  getStartItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndItem(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.orders.length ? this.orders.length : end;
  }
}
