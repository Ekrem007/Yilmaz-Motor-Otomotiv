import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../Models/product';
import { ProductWithCategoryNameDto } from '../Models/productWithCategoryNameDto';

// Genişletilmiş ürün arayüzü - indirim için ek alanlar içerir
export interface ExtendedProduct extends Product {
  originalPrice?: number;
  isDiscounted?: boolean;
}

// Genişletilmiş ürün kategori DTOsu
export interface ExtendedProductWithCategoryNameDto extends ProductWithCategoryNameDto {
  originalPrice?: number;
  isDiscounted?: boolean;
}

export interface CartItem {
  product: Product | ProductWithCategoryNameDto | ExtendedProduct | ExtendedProductWithCategoryNameDto;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  private currentUserId: number | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Constructor'da sepet yükleme - kullanıcı giriş yaptığında loadUserCart çağrılacak
  }

  // Kullanıcı sepetini yükle (giriş yapıldığında çağrılacak)
  loadUserCart(userId: number) {
    this.currentUserId = userId;
    this.loadCartFromStorage();
  }

  // Kullanıcı çıkış yaptığında sadece aktif kullanıcıyı temizle (sepet verilerini localStorage'da bırak)
  clearUserCart() {
    this.currentUserId = null;
    this.cartItems = [];
    this.cartItemsSubject.next(this.cartItems);
  }

  // Local storage'dan sepet verilerini yükle (kullanıcı ID'siyle birlikte)
  private loadCartFromStorage() {
    if (!isPlatformBrowser(this.platformId) || !this.currentUserId) return;
    
    const cartKey = `cart_user_${this.currentUserId}`;
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next(this.cartItems);
    } else {
      this.cartItems = [];
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  // Sepet verilerini local storage'a kaydet (kullanıcı ID'siyle birlikte)
  private saveCartToStorage() {
    if (!isPlatformBrowser(this.platformId) || !this.currentUserId) return;
    
    const cartKey = `cart_user_${this.currentUserId}`;
    localStorage.setItem(cartKey, JSON.stringify(this.cartItems));
    this.cartItemsSubject.next(this.cartItems);
  }

  // Ürünü sepete ekle
  addToCart(product: Product | ProductWithCategoryNameDto, quantity: number = 1, toastrService?: any) {
    if (!this.currentUserId) {
      console.warn('Sepete ürün eklemek için giriş yapmanız gerekiyor.');
      return false;
    }

    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    // Stok kontrolü
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantity + quantity;
    
    // Stok sayısını aşıyorsa işlemi engelle ve false döndür
    if (newTotalQuantity > product.stock) {
      if (toastrService) {
        toastrService.error(`Üzgünüz, bu üründen en fazla ${product.stock} adet ekleyebilirsiniz.`, 'Stok Yetersiz');
      }
      return false;
    }
    
    if (existingItem) {
      // Ürün zaten sepette varsa miktarını artır
      existingItem.quantity += quantity;
    } else {
      // Yeni ürün ekle
      this.cartItems.push({ product, quantity });
    }
    
    this.saveCartToStorage();
    return true;
  }

  // Sepetten ürün çıkar
  removeFromCart(productId: number) {
    if (!this.currentUserId) return;
    
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCartToStorage();
  }

  // Ürün miktarını güncelle
  updateQuantity(productId: number, quantity: number, toastrService?: any) {
    if (!this.currentUserId) return false;
    
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
        return true;
      } else {
        // Stok kontrolü
        if (quantity > item.product.stock) {
          if (toastrService) {
            toastrService.error(`Üzgünüz, bu üründen en fazla ${item.product.stock} adet ekleyebilirsiniz.`, 'Stok Yetersiz');
          }
          return false;
        }
        
        item.quantity = quantity;
        this.saveCartToStorage();
        return true;
      }
    }
    return false;
  }

  // Sepeti temizle
  clearCart() {
    this.cartItems = [];
    if (this.currentUserId && isPlatformBrowser(this.platformId)) {
      const cartKey = `cart_user_${this.currentUserId}`;
      localStorage.removeItem(cartKey);
    }
    this.cartItemsSubject.next(this.cartItems);
  }

  // Sepetteki toplam ürün sayısı
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Sepetteki toplam fiyat
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      // İndirimli fiyatı olan ürünler için indirimli fiyatı kullan
      const price = item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }
  
  // İndirimden kazanılan toplam tutar
  getTotalSavings(): number {
    return this.cartItems.reduce((total, item) => {
      // İndirimli ürünler için orijinal fiyat ve indirimli fiyat arasındaki fark
      const product = item.product as ExtendedProduct;
      if (product.originalPrice && product.isDiscounted) {
        return total + ((product.originalPrice - product.price) * item.quantity);
      }
      return total;
    }, 0);
  }

  // Sepetteki ürünleri getir
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  // Ürünün sepette olup olmadığını kontrol et
  isInCart(productId: number): boolean {
    return this.cartItems.some(item => item.product.id === productId);
  }

  // Belirli bir ürünün sepetteki miktarını getir
  getProductQuantity(productId: number): number {
    const item = this.cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }
}