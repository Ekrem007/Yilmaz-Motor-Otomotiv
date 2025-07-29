import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductReview, CreateProductReviewDto } from '../Models/productReview';
import { ResponseModel } from '../Models/responseModel';
import { ListResponseModel } from '../Models/listResponseModel';
import { TopRatedProductDto } from '../Models/topRatedProductDto';

@Injectable({
  providedIn: 'root'
})
export class ProductReviewService {
  private apiUrl = '/api/ProductReview';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ListResponseModel<ProductReview>> {
    return this.http.get<ListResponseModel<ProductReview>>(`${this.apiUrl}/getall`);
  }

  getByProductId(productId: number): Observable<ListResponseModel<ProductReview>> {
    // Backend'de bu endpoint yoksa, tüm yorumları çekip frontend'de filtrele
    return this.http.get<ListResponseModel<ProductReview>>(`${this.apiUrl}/getall`);
  }

  add(productReview: CreateProductReviewDto): Observable<ResponseModel<ProductReview>> {
    return this.http.post<ResponseModel<ProductReview>>(`${this.apiUrl}/add`, productReview);
  }

  delete(productReviewId: number): Observable<ResponseModel<any>> {
    return this.http.delete<ResponseModel<any>>(`${this.apiUrl}/delete/${productReviewId}`);
  }

  update(productReview: ProductReview, productReviewId: number): Observable<ResponseModel<ProductReview>> {
    return this.http.put<ResponseModel<ProductReview>>(`${this.apiUrl}/update/${productReviewId}`, productReview);
  }
  getTopRatingProducts(): Observable<ResponseModel<TopRatedProductDto>> {
    return this.http.get<ResponseModel<TopRatedProductDto>>(`${this.apiUrl}/getTopRatedProduct`);
  }
}
