import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../Models/listResponseModel';
import { DiscountedProductDto } from '../Models/discountedProductDto';
import { Discount } from '../Models/discountedProduct';

@Injectable({
  providedIn: 'root'
})
export class DiscountedProductService {

  constructor(private httpClient: HttpClient) { }
  apiUrl = 'https://localhost:7062/api/Discount';

  getDiscountedProducts(): Observable <ListResponseModel<DiscountedProductDto>> {
    return this.httpClient.get<ListResponseModel<DiscountedProductDto>>(this.apiUrl + '/getall');
  }
  addDiscountedProduct(discount: Discount): Observable<Discount> {
    return this.httpClient.post<Discount>(this.apiUrl + '/add', discount);
  }
  getDiscountedProductById(id: number): Observable<DiscountedProductDto> {
    return this.httpClient.get<DiscountedProductDto>(`${this.apiUrl}/getById/${id}`);
  }
}
