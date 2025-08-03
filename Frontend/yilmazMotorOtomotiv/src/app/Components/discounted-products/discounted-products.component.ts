import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { DiscountedProductService } from '../../Services/discounted-product.service';
import { DiscountedProductDto } from '../../Models/discountedProductDto';
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
  selector: 'app-discounted-products',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, TurkishCurrencyPipe],
  templateUrl: './discounted-products.component.html',
  styleUrl: './discounted-products.component.css'
})
export class DiscountedProductsComponent implements OnInit, OnDestroy {
  discountedProducts: ExtendedDiscountedProductDto[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  timerSubscription: Subscription | null = null;

  constructor(
    private discountedProductService: DiscountedProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDiscountedProducts();
  }

  getDiscountedProducts() {
    this.isLoading = true;

    this.discountedProductService.getDiscountedProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.discountedProducts = response.data.map(p => ({
            ...p,
            imageUrl: p.imageUrl || 'assets/img/product-placeholder.jpg'
          }));
          
          // İlk kez kalan süreyi hesapla
          this.updateRemainingTimes();
          
          // Timer başlat
          this.startTimer();
        } else {
          this.errorMessage = response.message || 'İndirimli ürünler alınırken bir hata oluştu.';
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('İndirimli ürünler alınırken bir hata oluştu:', error);
        this.errorMessage = 'İndirimli ürünler alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        this.isLoading = false;
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
      
      // Countdown sıfırlandığında günü azalt ve saatleri resetle
      this.discountedProducts.forEach(product => {
        if (this.shouldResetCountdown(product)) {
          this.resetCountdown(product);
        }
      });
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
  
  // Sayaç sıfırlanma kontrolü
  shouldResetCountdown(product: ExtendedDiscountedProductDto): boolean {
    if (!product.remainingTime) return false;
    
    const { days, hours, minutes, seconds } = product.remainingTime;
    
    // Eğer gün değeri varsa ve saat, dakika, saniye sıfırsa, countdown'u resetle
    return days > 0 && hours === 0 && minutes === 0 && seconds === 0;
  }
  
  // Countdown resetleme işlemi
  resetCountdown(product: ExtendedDiscountedProductDto): void {
    if (product.remainingTime && product.remainingTime.days > 0) {
      product.remainingTime = {
        days: product.remainingTime.days - 1,
        hours: 23,
        minutes: 59,
        seconds: 59
      };
    }
  }

  // Component yok edildiğinde timer'ı temizle
  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  navigateToProductDetail(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  // İndirim bitiş tarihi kontrolü
  isDiscountActive(endDate: string): boolean {
    const currentDate = new Date();
    const discountEndDate = new Date(endDate);
    return currentDate <= discountEndDate;
  }
  
  // Ürünün gösterilip gösterilmeyeceğini kontrol et
  isProductVisible(product: ExtendedDiscountedProductDto): boolean {
    // Kalan süre yoksa veya süresi bittiyse ürünü gösterme
    if (!product.remainingTime) return false;
    
    const { days, hours, minutes, seconds } = product.remainingTime;
    
    // Eğer gün 0 ve diğer değerler de 0 ise ürünü gösterme
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      return false;
    }
    
    return true;
  }
  
  // Boş ürün mesajının gösterilip gösterilmeyeceğini kontrol et
  shouldShowNoProductsMessage(): boolean {
    // Hiç ürün yoksa true döndür
    if (this.discountedProducts.length === 0) return true;
    
    // En az bir görünür ürün varsa false döndür
    for (const product of this.discountedProducts) {
      if (this.isProductVisible(product)) {
        return false;
      }
    }
    
    // Tüm ürünler görünmez durumdaysa true döndür
    return true;
  }
  
  // Hatayı çözmek için yedek fonksiyon
  hasProductsToShow(): boolean {
    return !this.shouldShowNoProductsMessage();
  }
}
