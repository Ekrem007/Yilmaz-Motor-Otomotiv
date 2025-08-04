import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { CartService } from '../../Services/cart.service';
import { ProductReviewService } from '../../Services/product-review.service';
import { AuthService } from '../../Services/auth.service';
import { DiscountedProductService } from '../../Services/discounted-product.service';
import { ProductWithCategoryNameDto } from '../../Models/productWithCategoryNameDto';
import { ProductReview, CreateProductReviewDto } from '../../Models/productReview';
import { DiscountedProductDto } from '../../Models/discountedProductDto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-product',
  imports: [CommonModule, NavbarComponent, TurkishCurrencyPipe, RouterModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit, OnDestroy {
  product: ProductWithCategoryNameDto | null = null;
  productReviews: ProductReview[] = [];
  isLoading = true;
  productNotFound = false;
  isLoadingReviews = false;
  
  // İndirimli ürün özellikleri
  discountedProducts: ExtendedDiscountedProductDto[] = [];
  discountedProductsMap: Map<number, ExtendedDiscountedProductDto> = new Map();
  timerSubscription: Subscription | null = null;
  
  // Review form properties
  newReview: CreateProductReviewDto = {
    productId: 0,
    userId: 0,
    reviewText: '',
    rating: 5
  };
  isSubmittingReview = false;
  currentUserId: number | null = null;
  
  // Rating statistics
  averageRating = 0;
  totalReviews = 0;
  ratingDistribution: { [key: number]: number } = {
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  };
  Math = Math; // Expose Math to template

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private productReviewService: ProductReviewService,
    private authService: AuthService,
    private discountedProductService: DiscountedProductService
  ) {}

  ngOnInit(): void {
    // Get current user ID
    this.currentUserId = this.authService.restoreSession();
    
    // İndirimli ürünleri yükle
    this.getDiscountedProducts();
    
    this.route.params.subscribe(params => {
      const productId = Number(params['id']);
      if (productId) {
        this.newReview.productId = productId;
        this.loadProduct(productId);
        this.loadProductReviews(productId);
      } else {
        this.productNotFound = true;
        this.isLoading = false;
      }
    });
  }
  
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadProduct(productId: number): void {
    this.isLoading = true;
    this.productService.getProductById(productId).subscribe({
      next: (response: any) => {
        // Backend response'un formatına göre ürün verisini al
        if (response && response.data) {
          this.product = response.data;
        } else {
          this.product = response;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Ürün yüklenirken hata:', error);
        this.productNotFound = true;
        this.isLoading = false;
      }
    });
  }

  addToCart(product: ProductWithCategoryNameDto): void {
    if (product.stock > 0) {
      // Ürünün indirimli olup olmadığını kontrol et
      if (this.hasDiscount(product.id)) {
        // İndirimli ürün için fiyatı güncelle
        const discountedPrice = this.getDiscountedPrice(product.id);
        const clonedProduct = {...product, price: discountedPrice, originalPrice: product.price, isDiscounted: true};
        this.cartService.addToCart(clonedProduct, 1);
      } else {
        // Normal ürün için direkt ekle
        this.cartService.addToCart(product, 1);
      }
    }
  }

  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  getProductQuantityInCart(productId: number): number {
    return this.cartService.getProductQuantity(productId);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  loadProductReviews(productId: number): void {
    this.isLoadingReviews = true;
    this.productReviewService.getByProductId(productId).subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          // Filter reviews by product ID since backend doesn't have this endpoint
          this.productReviews = response.data.filter((review: ProductReview) => review.productId === productId);
          this.calculateRatingStatistics();
        }
        this.isLoadingReviews = false;
      },
      error: (error: any) => {
        console.error('Yorumlar yüklenirken hata:', error);
        this.isLoadingReviews = false;
      }
    });
  }

  calculateRatingStatistics(): void {
    if (this.productReviews.length === 0) {
      this.averageRating = 0;
      this.totalReviews = 0;
      this.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      return;
    }

    this.totalReviews = this.productReviews.length;
    
    // Calculate average rating
    const totalRating = this.productReviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.totalReviews;

    // Calculate rating distribution
    this.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    this.productReviews.forEach(review => {
      this.ratingDistribution[review.rating]++;
    });
  }

  getRatingPercentage(rating: number): number {
    if (this.totalReviews === 0) return 0;
    return (this.ratingDistribution[rating] / this.totalReviews) * 100;
  }

  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  setRating(rating: number): void {
    this.newReview.rating = rating;
  }

  submitReview(): void {
    if (!this.currentUserId) {
      alert('Yorum yapabilmek için giriş yapmalısınız.');
      return;
    }

    if (!this.newReview.reviewText.trim()) {
      alert('Lütfen yorumunuzu yazın.');
      return;
    }

    this.newReview.userId = this.currentUserId;
    this.isSubmittingReview = true;

    this.productReviewService.add(this.newReview).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          alert('Yorumunuz başarıyla eklendi!');
          this.resetReviewForm();
          this.loadProductReviews(this.newReview.productId); // Reload reviews
          // Close modal (if using Bootstrap)
          const modal = document.getElementById('reviewModal');
          if (modal) {
            const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
            if (bootstrapModal) {
              bootstrapModal.hide();
            }
          }
        } else {
          alert(response.message || 'Yorum eklenirken bir hata oluştu.');
        }
        this.isSubmittingReview = false;
      },
      error: (error: any) => {
        console.error('Yorum eklenirken hata:', error);
        alert('Yorum eklenirken bir hata oluştu.');
        this.isSubmittingReview = false;
      }
    });
  }

  resetReviewForm(): void {
    this.newReview.reviewText = '';
    this.newReview.rating = 5;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR');
  }

  isLoggedIn(): boolean {
    return this.currentUserId !== null;
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
}
