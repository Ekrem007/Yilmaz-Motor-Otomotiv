import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../Models/responseModel';

// Kupon objesi için tip tanımı
export interface Coupon {
  id: number;
  couponName: string;
  discountAmount: number;
}

// Kupon kodu için yanıt verisi tipini tanımlıyoruz
export interface UserCouponCode {
  id: number;
  userId: number;
  couponCode: string;
  couponId: number;
  isUsed: boolean; // Backend'den gelen eski veri yapısıyla uyumluluk için bırakıldı
  usedDate: string | null; // Kupon kullanıldıysa tarihi burada olacak, kullanılmadıysa null olacak
  user: any; // User objesi nullable
  coupon: Coupon; // Coupon objesi
}

// Kupon kodu için response modeli
export interface UserCouponCodeResponse extends ResponseModel {
  data: UserCouponCode;
}

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiUrl = 'https://localhost:7062/api/UserCouponCode';

  constructor(private httpClient: HttpClient) { }

  // Kupon kodunu ID'ye göre getiren metot
  getCouponCodeById(id: number): Observable<UserCouponCodeResponse> {
    return this.httpClient.get<UserCouponCodeResponse>(`${this.apiUrl}/getById/${id}`);
  }

  // Kupon kodunu doğrulayan metot - kupon kodu string ile
  validateCouponCode(couponCode: string): Observable<UserCouponCodeResponse> {
    return this.httpClient.get<UserCouponCodeResponse>(`${this.apiUrl}/getByCode/${couponCode}`);
  }



  // Kupon kodunu kullanıldı olarak işaretleyen metot
  markCouponUsed(id: number): Observable<ResponseModel> {
    console.log('Kupon kullanıldı olarak işaretleniyor...');
    return this.httpClient.put<ResponseModel>(`${this.apiUrl}/markUsed/${id}`, {});
  }

  // Kullanıcı ID'sine göre tüm kuponları getiren metot
  getUserCoupons(userId: number): Observable<ResponseModel<UserCouponCode[]>> {
    return this.httpClient.get<ResponseModel<UserCouponCode[]>>(`${this.apiUrl}/getByUserId/${userId}`);
  }
}
