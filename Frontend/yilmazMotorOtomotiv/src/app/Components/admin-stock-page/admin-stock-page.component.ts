import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../Services/product.service';
import { ProductWithCategoryNameDto } from '../../Models/productWithCategoryNameDto';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-stock-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-stock-page.component.html',
  styleUrl: './admin-stock-page.component.css'
})
export class AdminStockPageComponent implements OnInit {
  products: ProductWithCategoryNameDto[] = [];
  filteredProducts: ProductWithCategoryNameDto[] = [];
  pagedProducts: ProductWithCategoryNameDto[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';
  // Pagination
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;
  // Stok ekleme için
  selectedProductId: number | null = null;
  quantityToAdd: number = 0;
  
  constructor(
    private productService: ProductService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Admin kontrolü
    if (!this.authService.isAdmin()) {
      this.toastrService.error('Bu sayfaya erişim yetkiniz bulunmamaktadır', 'Yetkisiz Erişim');
      this.router.navigate(['/']);
      return;
    }
    
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
          this.filteredProducts = [...this.products];
          this.currentPage = 1;
          this.updatePagination();
        } else {
          this.toastrService.error('Ürünler yüklenirken bir hata oluştu', 'Hata');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ürün listesi alınırken hata:', error);
        this.toastrService.error('Ürün listesi alınırken bir hata oluştu', 'Hata');
        this.isLoading = false;
      }
    });
  }
  
  searchProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = [...this.products];
      this.currentPage = 1;
      this.updatePagination();
      return;
    }
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(term) || 
      product.categoryName.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProducts = this.filteredProducts.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  
  addStock(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.toastrService.warning('Lütfen geçerli bir miktar girin', 'Uyarı');
      return;
    }
    
    this.isLoading = true;
    this.productService.addStockToProduct(productId, quantity).subscribe({
      next: (response) => {
        if (response.success) {
          // Stok başarıyla eklendikten sonra ürün listesini yeniden yükle
          this.toastrService.success('Stok başarıyla eklendi', 'Başarılı');
          this.loadProducts();
          this.quantityToAdd = 0;
          this.selectedProductId = null;
        } else {
          this.toastrService.error(response.message || 'Stok eklenirken bir hata oluştu', 'Hata');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Stok eklenirken hata:', error);
        this.toastrService.error('Stok eklenirken bir hata oluştu', 'Hata');
        this.isLoading = false;
      }
    });
  }
  
  selectProduct(productId: number): void {
    this.selectedProductId = productId;
    this.quantityToAdd = 0;
  }
}
