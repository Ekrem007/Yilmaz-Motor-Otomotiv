import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../Models/listResponseModel';
import { Product } from '../Models/product';
import { ProductWithCategoryNameDto } from '../Models/productWithCategoryNameDto';
import { Category } from '../Models/category';
import { ResponseModel } from '../Models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient : HttpClient) { }

  apiUrl = "https://localhost:7062/api/Product";
  
  getProducts(): Observable<ListResponseModel<ProductWithCategoryNameDto>> {
    return this.httpClient.get<ListResponseModel<ProductWithCategoryNameDto>>(this.apiUrl + "/getall");
  }

  updateProduct(product: Product, productId: number): Observable<ResponseModel> {
    return this.httpClient.put<ResponseModel>(this.apiUrl + "/update/" + productId, product);
  }

  addProduct(product: Product): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "/add", product);
  }
  deleteProduct(productId:number):Observable<ResponseModel>{
    return this.httpClient.delete<ResponseModel>(this.apiUrl + "/delete/" + productId,);
  }
   getProductsByCategory(categoryId: number): Observable<ListResponseModel<Product>> {
    return this.httpClient.get<ListResponseModel<Product>>(this.apiUrl + '/getproductsbycategoryid/' + categoryId);
  }

  getProductsByName(name: string): Observable<ListResponseModel<ProductWithCategoryNameDto>> {
    return this.httpClient.get<ListResponseModel<ProductWithCategoryNameDto>>(this.apiUrl + '/getProductsByName/' + encodeURIComponent(name));
  }
  getProductById(productId: number): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl + '/getbyid/' + productId);
  }
}


