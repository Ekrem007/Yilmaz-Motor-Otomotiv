import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from './../../Services/product.service';
import { CategoryService } from '../../Services/category.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../Models/product';
import { ProductWithCategoryNameDto } from '../../Models/productWithCategoryNameDto';
import { Category } from '../../Models/category';
import { ResponseModel } from '../../Models/responseModel';
import { ToastrService } from 'ngx-toastr';
import { TurkishCurrencyPipe } from '../../pipes/turkish-currency.pipe';

@Component({
  selector: 'app-product-admin-page',
  imports: [CommonModule, FormsModule, TurkishCurrencyPipe],
  templateUrl: './product-admin-page.component.html',
  styleUrl: './product-admin-page.component.css'
})
export class ProductAdminPageComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}
  
  products: ProductWithCategoryNameDto[] = [];
  categories: Category[] = [];
  searchTerm: string = '';
  selectedProduct: Product | null = null;
  isEditing: boolean = false;
  isAdding: boolean = false;
  newProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    categoryId: 0,
    stock: 0
  };

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }
  getProducts() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data; 
        this.calculateTotalPages();
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  //filter
  get filteredProducts() {
    if (!this.searchTerm) {
      return this.products;
    }
    return this.products.filter(product => 
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Pagination Methods
  calculateTotalPages(): void {
    const filteredCount = this.filteredProducts.length;
    this.totalPages = Math.ceil(filteredCount / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  getPaginatedProducts(): ProductWithCategoryNameDto[] {
    const filtered = this.filteredProducts;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
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
    const filteredCount = this.filteredProducts.length;
    if (filteredCount === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndItem(): number {
    const filteredCount = this.filteredProducts.length;
    const end = this.currentPage * this.itemsPerPage;
    return end > filteredCount ? filteredCount : end;
  }

  onSearchChange(): void {
    this.currentPage = 1; // Arama yapıldığında ilk sayfaya git
    this.calculateTotalPages();
  }

  // Ürün düzenleme modunu başlat
  editProduct(product: ProductWithCategoryNameDto) {
    // Kategori adından kategori ID'sini bul
    const category = this.categories.find(cat => cat.name === product.categoryName);
    const categoryId = category ? category.id : 1;

    // DTO'dan Product'a dönüştür
    this.selectedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      categoryId: categoryId
    };
    this.isEditing = true;
  }

  // Ürün güncelleme işlemi
  updateProduct() {
    if (this.selectedProduct && this.selectedProduct.id) {
      this.productService.updateProduct(this.selectedProduct, this.selectedProduct.id).subscribe({
        next: (response: ResponseModel) => {
          if (response.success) {
            // Listeyi yeniden yükle (güncel kategori adları ile)
            this.getProducts();
            
            // Düzenleme modunu kapat
            this.cancelEdit();
            
            // Başarı toastr mesajı
            this.toastr.success('Ürün başarıyla güncellendi!', 'Başarılı');
          } else {
            console.error('Güncelleme hatası:', response.message);
            this.toastr.error(response.message, 'Hata');
          }
        },
        error: (error) => {
          console.error('API Hatası:', error);
          this.toastr.error('Bir hata oluştu. Lütfen tekrar deneyin.', 'Hata');
        }
      });
    }
  }

  // Düzenleme modunu iptal et
  cancelEdit() {
    this.selectedProduct = null;
    this.isEditing = false;
  }

  // Yeni ürün ekleme modunu başlat
  startAddProduct() {
    this.newProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      categoryId: 0,
      stock: 0
    };
    this.isAdding = true;
    this.isEditing = false;
  }

  // Yeni ürün ekleme işlemi
  addProduct() {
    if (this.newProduct.categoryId === 0) {
      this.toastr.warning('Lütfen bir kategori seçin.', 'Uyarı');
      return;
    }

    // ID'yi kaldır çünkü backend tarafında otomatik assign edilecek
    const productToAdd = { ...this.newProduct };
    delete (productToAdd as any).id;

    this.productService.addProduct(productToAdd).subscribe({
      next: (response: ResponseModel) => {
        if (response.success) {
          // Listeyi yeniden yükle
          this.getProducts();
          
          // Ekleme modunu kapat
          this.cancelAdd();
          
          // Başarı toastr mesajı
          this.toastr.success('Ürün başarıyla eklendi!', 'Başarılı');
        } else {
          console.error('Ekleme hatası:', response.message);
          this.toastr.error(response.message, 'Hata');
        }
      },
      error: (error) => {
        console.error('API Hatası:', error);
        this.toastr.error('Bir hata oluştu. Lütfen tekrar deneyin.', 'Hata');
      }
    });
  }

  // Ürün ekleme modunu iptal et
  cancelAdd() {
    this.isAdding = false;
    this.newProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      categoryId: 0,
      stock: 0
    };
  }

  // Ürün silme işlemi
  deleteProduct(productId: number) {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: (response: ResponseModel) => {
          if (response.success) {
            this.getProducts(); 
            this.toastr.success('Ürün başarıyla silindi!', 'Başarılı');
          } else {
            console.error('Silme hatası:', response.message);
            this.toastr.error(response.message, 'Hata');
          }
        },
        error: (error) => {
          console.error('API Hatası:', error);
          this.toastr.error('Bir hata oluştu. Lütfen tekrar deneyin.', 'Hata');
        }
      });
    }
  }
  
  
}
