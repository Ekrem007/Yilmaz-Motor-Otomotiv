import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../Services/product.service';
import { CategoryService } from '../../Services/category.service';
import { CartService } from '../../Services/cart.service';
import { AuthService } from '../../Services/auth.service';
import { Product } from '../../Models/product';
import { ProductWithCategoryNameDto } from '../../Models/productWithCategoryNameDto';
import { Category } from '../../Models/category';
import { NavbarComponent } from '../navbar/navbar.component';
import { TurkishCurrencyPipe } from '../../pipes/turkish-currency.pipe';

@Component({
  selector: 'app-customer-product-page',
  imports: [CommonModule, RouterModule, NavbarComponent, TurkishCurrencyPipe],
  templateUrl: './customer-product-page.component.html',
  styleUrl: './customer-product-page.component.css'
})
export class CustomerProductPageComponent implements OnInit {
  products: Product[] = [];
  allProducts: ProductWithCategoryNameDto[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  selectedCategoryName: string = '';
  isLoading: boolean = true;
  searchTerm: string = '';
  isSearchMode: boolean = false;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getCategories();
    
    // Route params ve query params'i dinle
    this.route.params.subscribe(params => {
      const categoryId = params['categoryId'];
      if (categoryId) {
        this.selectedCategoryId = +categoryId;
        this.isSearchMode = false;
        this.getProductsByCategory(this.selectedCategoryId);
      }
    });

    this.route.queryParams.subscribe(queryParams => {
      const search = queryParams['search'];
      if (search) {
        this.searchTerm = search;
        this.isSearchMode = true;
        this.selectedCategoryId = null;
        this.searchProducts(search);
      } else if (!this.selectedCategoryId) {
        this.getAllProducts();
      }
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data || [];
        if (this.selectedCategoryId) {
          const category = this.categories.find(c => c.id === this.selectedCategoryId);
          this.selectedCategoryName = category ? category.name : '';
        }
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.categories = [];
      }
    });
  }

  getProductsByCategory(categoryId: number) {
    this.isLoading = true;
    this.currentPage = 1; // Reset to first page
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (response) => {
        this.products = response.data || [];
        this.calculateTotalPages();
        this.isLoading = false;
        const category = this.categories.find(c => c.id === categoryId);
        this.selectedCategoryName = category ? category.name : '';
      },
      error: (error) => {
        console.error('Error fetching products by category:', error);
        this.products = [];
        this.calculateTotalPages();
        this.isLoading = false;
      }
    });
  }

  getAllProducts() {
    this.isLoading = true;
    this.currentPage = 1; // Reset to first page
    this.selectedCategoryId = null;
    this.isSearchMode = false;
    this.selectedCategoryName = 'Tüm Ürünler';
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.allProducts = response.data || [];
        this.calculateTotalPages();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching all products:', error);
        this.allProducts = [];
        this.calculateTotalPages();
        this.isLoading = false;
      }
    });
  }

  searchProducts(searchTerm: string) {
    this.isLoading = true;
    this.currentPage = 1; // Reset to first page
    this.selectedCategoryId = null;
    this.isSearchMode = true;
    this.selectedCategoryName = `"${searchTerm}" Arama Sonuçları`;
    this.productService.getProductsByName(searchTerm).subscribe({
      next: (response) => {
        this.allProducts = response.data || [];
        this.calculateTotalPages();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.allProducts = [];
        this.calculateTotalPages();
        this.isLoading = false;
      }
    });
  }

  // Ürünü sepete ekleme fonksiyonu
  addToCart(product: Product | ProductWithCategoryNameDto) {
    // Önce kullanıcının giriş yapıp yapmadığını kontrol et
    if (!this.authService.isLoggedIn()) {
      // Kullanıcı giriş yapmamışsa, kullanıcıyı uyar ve login sayfasına yönlendir
      this.toastrService.info('Lütfen sepete ürün eklemek için giriş yapın.', 'Giriş Yapılmadı');
      this.router.navigate(['/login']);
      return;
    }

    // Kullanıcı giriş yapmışsa ve stok varsa sepete ekle
    if (product.stock > 0) {
      this.cartService.addToCart(product);
      // Kullanıcıya başarı mesajı gösterebilirsiniz (isteğe bağlı)
      console.log(`${product.name} sepete eklendi!`);
    }
  }

  // Ürünün sepette olup olmadığını kontrol etme
  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  // Ürünün sepetteki miktarını getirme
  getProductQuantityInCart(productId: number): number {
    return this.cartService.getProductQuantity(productId);
  }

  // Pagination Methods
  calculateTotalPages(): void {
    const totalItems = this.selectedCategoryId 
      ? (this.products?.length || 0) 
      : (this.allProducts?.length || 0);
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  getPaginatedProducts(): (Product | ProductWithCategoryNameDto)[] {
    const items = this.selectedCategoryId 
      ? (this.products || []) 
      : (this.allProducts || []);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return items.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
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
    const totalItems = this.selectedCategoryId 
      ? (this.products?.length || 0) 
      : (this.allProducts?.length || 0);
    if (totalItems === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndItem(): number {
    const totalItems = this.selectedCategoryId 
      ? (this.products?.length || 0) 
      : (this.allProducts?.length || 0);
    const end = this.currentPage * this.itemsPerPage;
    return end > totalItems ? totalItems : end;
  }

  getTotalItems(): number {
    return this.selectedCategoryId 
      ? (this.products?.length || 0) 
      : (this.allProducts?.length || 0);
  }

  getCategoryName(product: Product | ProductWithCategoryNameDto): string {
    return 'categoryName' in product ? product.categoryName : '';
  }
}
