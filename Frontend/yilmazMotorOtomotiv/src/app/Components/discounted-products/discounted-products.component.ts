import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { DiscountedProductService } from '../../Services/discounted-product.service';
import { DiscountedProductDto } from '../../Models/discountedProductDto';
import { TurkishCurrencyPipe } from '../../pipes/turkish-currency.pipe';

@Component({
  selector: 'app-discounted-products',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, TurkishCurrencyPipe],
  templateUrl: './discounted-products.component.html',
  styleUrl: './discounted-products.component.css'
})
export class DiscountedProductsComponent implements OnInit {
  discountedProducts: DiscountedProductDto[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

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
        // imageUrl'yi büyük harfli ImageUrl olarak eşliyoruz
        this.discountedProducts = response.data.map(p => ({
          ...p,
          ImageUrl: p.imageUrl // HTML'de kullanacağın isimle eşleşiyor
        }));
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


  navigateToProductDetail(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  // İndirim bitiş tarihi kontrolü
  isDiscountActive(endDate: string): boolean {
    const currentDate = new Date();
    const discountEndDate = new Date(endDate);
    return currentDate <= discountEndDate;
  }

  // Kalan gün hesaplama
  calculateRemainingDays(endDate: string): number {
    const currentDate = new Date();
    const discountEndDate = new Date(endDate);
    const differenceInTime = discountEndDate.getTime() - currentDate.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24));
  }
}
