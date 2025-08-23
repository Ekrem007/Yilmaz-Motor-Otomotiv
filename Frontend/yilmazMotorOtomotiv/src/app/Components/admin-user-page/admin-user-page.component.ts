import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { CouponService } from '../../Services/coupon.service';
import { Coupon } from '../../Models/coupon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../Models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-user-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-page.component.html',
  styleUrl: './admin-user-page.component.css'
})
export class AdminUserPageComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  coupons: Coupon[] = [];
  showModal = false;
  selectedUserId: number | null = null;
  isLoading = false;
  
  // Math object for template
  Math = Math;
  
  // Search and pagination properties
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalUsers: number = 0;

  constructor(
    private userService: UserService,
    private couponService: CouponService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getUsers();
    this.getCoupons();
  }

  getUsers(){
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.data;
        this.filteredUsers = [...this.users];
        this.totalUsers = this.users.length;
        this.updatePagination();
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  getCoupons(){
    this.couponService.getAllCoupons().subscribe({
      next: (response) => {
        this.coupons = response.data || [];
      },
      error: (error) => {
        console.error('Error fetching coupons:', error);
      }
    });
  }

  // Search functionality
  onSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredUsers = [...this.users];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user => 
        user.userName.toLowerCase().includes(searchLower) ||
        user.name.toLowerCase().includes(searchLower) ||
        user.surName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  // Clear search
  clearSearch() {
    this.searchTerm = '';
    this.onSearch();
  }

  // Pagination functionality
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  openCouponModal(userId: number) {
    this.selectedUserId = userId;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUserId = null;
  }

  assignCoupon(couponId: number) {
    if (this.selectedUserId && !this.isLoading) {
      this.isLoading = true;
      this.couponService.addCouponToUser(this.selectedUserId, couponId).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastrService.info('Kupon başarıyla kullanıcıya tanımlandı!', 'Başarılı');
            this.closeModal();
          } else {
            this.toastrService.error('Kupon tanımlama işlemi başarısız: ' + response.message, 'Hata');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error assigning coupon:', error);
          this.toastrService.error('Kupon tanımlama sırasında bir hata oluştu!', 'Hata');
          this.isLoading = false;
        }
      });
    }
  }
}
