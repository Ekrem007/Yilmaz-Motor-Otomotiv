import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiscountedProductService } from '../../Services/discounted-product.service';
import { ProductService } from '../../Services/product.service';
import { Discount } from '../../Models/discountedProduct';
import { ProductWithCategoryNameDto } from '../../Models/productWithCategoryNameDto';
import { TurkishCurrencyPipe } from '../../pipes/turkish-currency.pipe';

@Pipe({
  name: 'groupProductsByCategory',
  standalone: true
})
export class GroupProductsByCategoryPipe implements PipeTransform {
  transform(products: ProductWithCategoryNameDto[]): any[] {
    if (!products || products.length === 0) return [];
    
    const categoryMap = new Map<string, ProductWithCategoryNameDto[]>();
    
    // Ürünleri kategorilerine göre grupla
    products.forEach(product => {
      const categoryName = product.categoryName || 'Kategorisiz';
      
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, []);
      }
      
      categoryMap.get(categoryName)?.push(product);
    });
    
    // Map'i array'e dönüştür
    const result = Array.from(categoryMap).map(([categoryName, products]) => ({
      categoryName,
      products
    }));
    
    // Kategorileri alfabetik sıraya göre sırala
    return result.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  }
};

@Component({
  selector: 'app-discount-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TurkishCurrencyPipe, GroupProductsByCategoryPipe],
  templateUrl: './discount-admin-page.component.html',
  styleUrls: ['./discount-admin-page.component.css']
})
export class DiscountAdminPageComponent implements OnInit {
  products: ProductWithCategoryNameDto[] = [];
  discounts: any[] = [];
  discountForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  selectedProduct: ProductWithCategoryNameDto | null = null;
  minEndDate: string;

  constructor(
    private discountedProductService: DiscountedProductService,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    // Set minimum end date as tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minEndDate = tomorrow.toISOString().split('T')[0];
    
    this.discountForm = this.formBuilder.group({
      productId: [null, Validators.required],
      rate: [null, [Validators.required, Validators.min(1), Validators.max(99)]],
      endDate: [this.minEndDate, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadDiscounts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ürünler yüklenirken hata oluştu:', error);
        this.errorMessage = 'Ürünler yüklenirken bir hata oluştu.';
        this.isLoading = false;
      }
    });
  }

  loadDiscounts() {
    this.isLoading = true;
    this.discountedProductService.getDiscountedProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.discounts = response.data;
        } else {
          this.errorMessage = response.message || 'İndirimli ürünler alınırken bir hata oluştu.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('İndirimli ürünler yüklenirken bir hata oluştu:', error);
        this.errorMessage = 'İndirimli ürünler yüklenirken bir hata oluştu.';
        this.isLoading = false;
      }
    });
  }

  onProductChange() {
    const productId = this.discountForm.get('productId')?.value;
    if (productId) {
      this.selectedProduct = this.products.find(p => p.id === parseInt(productId)) || null;
    } else {
      this.selectedProduct = null;
    }
  }

  onSubmit() {
    if (this.discountForm.invalid) {
      this.errorMessage = 'Lütfen tüm alanları doğru bir şekilde doldurunuz.';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const discountData: Discount = {
      productId: parseInt(this.discountForm.get('productId')?.value),
      rate: parseFloat(this.discountForm.get('rate')?.value),
      endDate: new Date(this.discountForm.get('endDate')?.value + 'T23:59:59').toISOString()
    };

    this.discountedProductService.addDiscountedProduct(discountData).subscribe({
      next: (response) => {
        this.successMessage = 'İndirim başarıyla eklendi.';
        this.discountForm.reset({
          productId: null,
          rate: null,
          endDate: this.minEndDate
        });
        this.selectedProduct = null;
        this.loadDiscounts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('İndirim eklenirken bir hata oluştu:', error);
        this.errorMessage = error.error?.message || 'İndirim eklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        this.isLoading = false;
      }
    });
  }

  // Ürünün ismini ID'ye göre bulma
  getProductName(productId: number): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : 'Ürün bulunamadı';
  }

  // İndirimin bitiş tarihini formatla
  formatEndDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  }

  // İndirimin bitiş tarihinin geçip geçmediğini kontrol et
  isDiscountActive(endDate: string): boolean {
    const currentDate = new Date();
    const discountEndDate = new Date(endDate);
    return currentDate <= discountEndDate;
  }

  // Toplam indirim miktarını hesapla
  calculateDiscountedPrice(originalPrice: number, discountRate: number): number {
    return originalPrice - (originalPrice * (discountRate / 100));
  }
}
