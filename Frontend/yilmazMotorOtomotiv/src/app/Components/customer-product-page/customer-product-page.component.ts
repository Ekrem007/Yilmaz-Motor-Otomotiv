import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../Services/product.service';
import { CategoryService } from '../../Services/category.service';
import { CartService } from '../../Services/cart.service';
import { AuthService } from '../../Services/auth.service';
import { DiscountedProductService } from '../../Services/discounted-product.service';
import { Product } from '../../Models/product';
import { ProductWithCategoryNameDto } from '../../Models/productWithCategoryNameDto';
import { Category } from '../../Models/category';
import { DiscountedProductDto } from '../../Models/discountedProductDto';
import { NavbarComponent } from '../navbar/navbar.component';
import { TurkishCurrencyPipe } from '../../pipes/turkish-currency.pipe';
import { interval, Subscription } from 'rxjs';

interface ExtendedDiscountedProductDto extends DiscountedProductDto {
  remainingTime?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

@Component({
  selector: 'app-customer-product-page',
  imports: [CommonModule, RouterModule, NavbarComponent, TurkishCurrencyPipe],
  templateUrl: './customer-product-page.component.html',
  styleUrl: './customer-product-page.component.css'
})
export class CustomerProductPageComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  allProducts: ProductWithCategoryNameDto[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  selectedCategoryName: string = '';
  isLoading: boolean = true;
  searchTerm: string = '';
  isSearchMode: boolean = false;
  
  // İndirimli ürün özellikleri
  discountedProducts: ExtendedDiscountedProductDto[] = [];
  discountedProductsMap: Map<number, ExtendedDiscountedProductDto> = new Map();
  timerSubscription: Subscription | null = null;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 0;

  // Karşılaştırma sistemi özellikleri
  compareProducts: (Product | ProductWithCategoryNameDto)[] = [];
  maxCompareProducts: number = 3;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private discountedProductService: DiscountedProductService
  ) {}

  ngOnInit() {
    this.getCategories();
    this.getDiscountedProducts();
    
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
  
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
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
      // Ürünün indirimli olup olmadığını kontrol et
      if (this.hasDiscount(product.id)) {
        // İndirimli ürün için fiyatı güncelle
        const discountedPrice = this.getDiscountedPrice(product.id);
        const clonedProduct = {...product, price: discountedPrice, originalPrice: product.price, isDiscounted: true};
        const result = this.cartService.addToCart(clonedProduct, 1, this.toastrService);
        if (result) {
          this.toastrService.success(`${product.name} indirimli fiyatla sepete eklendi!`, 'Sepete Eklendi');
        }
      } else {
        // Normal ürün için direkt ekle
        const result = this.cartService.addToCart(product, 1, this.toastrService);
        if (result) {
          this.toastrService.success(`${product.name} sepete eklendi!`, 'Sepete Eklendi');
        }
      }
    } else {
      this.toastrService.error(`${product.name} stokta bulunmamaktadır.`, 'Stok Yetersiz');
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

  navigateToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  // İndirimli ürünlerle ilgili metodlar
  getDiscountedProducts() {
    this.discountedProductService.getDiscountedProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.discountedProducts = response.data.map(p => ({
            ...p,
            imageUrl: p.imageUrl || 'assets/img/product-placeholder.jpg'
          }));
          
          // İndirimli ürünleri map olarak sakla (hızlı erişim için)
          this.discountedProductsMap = new Map();
          this.discountedProducts.forEach(product => {
            this.discountedProductsMap.set(product.productId, product);
          });
          
          // İlk kez kalan süreyi hesapla
          this.updateRemainingTimes();
          
          // Timer başlat
          this.startTimer();
        } else {
          console.error('İndirimli ürünler alınırken bir hata oluştu.');
        }
      },
      error: (error) => {
        console.error('İndirimli ürünler alınırken bir hata oluştu:', error);
      }
    });
  }
  
  // Her saniye çalışacak timer
  startTimer() {
    // Önceki timer'ı temizle
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    
    // Her saniye çalışan bir timer kur
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateRemainingTimes();
    });
  }

  // Tüm ürünlerin kalan sürelerini güncelle
  updateRemainingTimes() {
    this.discountedProducts.forEach(product => {
      product.remainingTime = this.calculateRemainingTime(product.discountEndDate);
    });
  }

  // Kalan süreyi hesapla (gün, saat, dakika, saniye)
  calculateRemainingTime(endDate: string) {
    const currentDate = new Date();
    const discountEndDate = new Date(endDate);
    let differenceInMs = discountEndDate.getTime() - currentDate.getTime();
    
    // Süre bittiyse 0 değerleri döndür
    if (differenceInMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    // Hesaplamalar
    const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    differenceInMs -= days * 1000 * 60 * 60 * 24;
    
    const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
    differenceInMs -= hours * 1000 * 60 * 60;
    
    const minutes = Math.floor(differenceInMs / (1000 * 60));
    differenceInMs -= minutes * 1000 * 60;
    
    const seconds = Math.floor(differenceInMs / 1000);
    
    return { days, hours, minutes, seconds };
  }
  
  // İndirim aktif mi kontrolü
  isDiscountActive(endDate: string): boolean {
    const currentDate = new Date();
    const discountEndDate = new Date(endDate);
    return currentDate <= discountEndDate;
  }
  
  // Ürünün indirimli olup olmadığını kontrol et
  hasDiscount(productId: number): boolean {
    return this.discountedProductsMap.has(productId) && 
           this.isDiscountActive(this.discountedProductsMap.get(productId)!.discountEndDate);
  }
  
  // Ürünün indirimli fiyatını getir
  getDiscountedPrice(productId: number): number {
    if (this.hasDiscount(productId)) {
      return this.discountedProductsMap.get(productId)!.discountedPrice;
    }
    return 0;
  }
  
  // İndirim oranını getir
  getDiscountRate(productId: number): number {
    if (this.hasDiscount(productId)) {
      return this.discountedProductsMap.get(productId)!.discountRate;
    }
    return 0;
  }
  
  // Kalan süreyi getir
  getRemainingTime(productId: number) {
    if (this.hasDiscount(productId)) {
      return this.discountedProductsMap.get(productId)!.remainingTime;
    }
    return null;
  }

  // Karşılaştırma sistemi metodları
  addToCompare(product: Product | ProductWithCategoryNameDto, event: Event) {
    event.stopPropagation();
    
    // Eğer ürün zaten karşılaştırmada varsa, çıkar
    if (this.isInCompare(product.id)) {
      this.removeFromCompare(product.id);
      return;
    }

    // Maksimum ürün sayısını kontrol et
    if (this.compareProducts.length >= this.maxCompareProducts) {
      this.toastrService.warning(`Maksimum ${this.maxCompareProducts} ürün karşılaştırabilirsiniz!`, 'Karşılaştırma Limiti');
      return;
    }

    // Ürünü karşılaştırma listesine ekle
    this.compareProducts.push(product);
    this.toastrService.success(`${product.name} karşılaştırma listesine eklendi!`, 'Karşılaştırmaya Eklendi');
  }

  removeFromCompare(productId: number) {
    const index = this.compareProducts.findIndex(p => p.id === productId);
    if (index > -1) {
      const removedProduct = this.compareProducts[index];
      this.compareProducts.splice(index, 1);
      this.toastrService.info(`${removedProduct.name} karşılaştırma listesinden çıkarıldı!`, 'Karşılaştırmadan Çıkarıldı');
    }
  }

  isInCompare(productId: number): boolean {
    return this.compareProducts.some(p => p.id === productId);
  }

  canShowCompareModal(): boolean {
    return this.compareProducts.length >= 2;
  }

  showCompareModal() {
    // Modal açma işlemi - şimdilik console.log ile test edelim
    if (this.canShowCompareModal()) {
      console.log('Karşılaştırma modalı açılacak:', this.compareProducts);
      // Burada modal açma işlemi yapılacak
      this.openCompareModal();
    } else {
      this.toastrService.warning('Karşılaştırma yapmak için en az 2 ürün seçmelisiniz!', 'Yetersiz Ürün');
    }
  }

  openCompareModal() {
    // Modal açma işlemi - Bootstrap modal kullanacağız
    const modalElement = document.getElementById('compareModal');
    if (modalElement) {
      // @ts-ignore
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  clearCompareList() {
    this.compareProducts = [];
    this.toastrService.info('Karşılaştırma listesi temizlendi!', 'Liste Temizlendi');
  }
}
