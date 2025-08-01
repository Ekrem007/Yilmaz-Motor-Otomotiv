import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../Models/product';
import { ProductWithCategoryNameDto } from '../Models/productWithCategoryNameDto';

export interface CartItem {
  product: Product | ProductWithCategoryNameDto;
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
  addToCart(product: Product | ProductWithCategoryNameDto, quantity: number = 1) {
    if (!this.currentUserId) {
      console.warn('Sepete ürün eklemek için giriş yapmanız gerekiyor.');
      return;
    }

    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      // Ürün zaten sepette varsa miktarını artır
      existingItem.quantity += quantity;
    } else {
      // Yeni ürün ekle
      this.cartItems.push({ product, quantity });
    }
    
    this.saveCartToStorage();
  }

  // Sepetten ürün çıkar
  removeFromCart(productId: number) {
    if (!this.currentUserId) return;
    
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCartToStorage();
  }

  // Ürün miktarını güncelle
  updateQuantity(productId: number, quantity: number) {
    if (!this.currentUserId) return;
    
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCartToStorage();
      }
    }
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
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
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