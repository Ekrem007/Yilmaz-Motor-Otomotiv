import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../Models/listResponseModel';
import { Category } from '../Models/category';
import { ResponseModel } from '../Models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = "https://localhost:7062/api/Category";

  getCategories(): Observable<ListResponseModel<Category>> {
    return this.httpClient.get<ListResponseModel<Category>>(this.apiUrl + "/getall");
  }
  addCategory(category: Category): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "/add", category);
  }
  updateCategory(category: Category, categoryId: number): Observable<ResponseModel> {
    return this.httpClient.put<ResponseModel>(this.apiUrl + "/update/" + categoryId, category);
  }
  deleteCategory(categoryId: number): Observable<ResponseModel> {
    return this.httpClient.delete<ResponseModel>(this.apiUrl + "/delete/" + categoryId);
  }
}
