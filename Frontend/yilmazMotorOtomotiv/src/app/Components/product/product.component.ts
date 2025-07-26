import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { CartService } from '../../Services/cart.service';
import { ProductReviewService } from '../../Services/product-review.service';
import { AuthService } from '../../Services/auth.service';
import { ProductWithCategoryNameDto } from '../../Models/productWithCategoryNameDto';
import { ProductReview, CreateProductReviewDto } from '../../Models/productReview';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { TurkishCurrencyPipe } from '../../pipes/turkish-currency.pipe';

@Component({
  selector: 'app-product',
  imports: [CommonModule, NavbarComponent, TurkishCurrencyPipe, RouterModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  product: ProductWithCategoryNameDto | null = null;
  productReviews: ProductReview[] = [];
  isLoading = true;
  productNotFound = false;
  isLoadingReviews = false;
  
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get current user ID
    this.currentUserId = this.authService.restoreSession();
    
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
      this.cartService.addToCart(product, 1);
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
}
