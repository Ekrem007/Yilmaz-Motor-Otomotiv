import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UserDto, UpdateUserDto } from '../Models/userDto';
import { ListResponseModel } from '../Models/listResponseModel';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/Auth';
  private userApiUrl = 'https://localhost:7062/api/User';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getUserById(userId: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/getUserById/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Kullanıcı bilgileri alınırken hata oluştu:', error);
        return throwError(() => error);
      })
    );
  }

  updateUser(userId: number, updateData: UpdateUserDto): Observable<any> {
    console.log('Update request URL:', `${this.apiUrl}/update/${userId}`);
    console.log('Update data:', updateData);
    
    return this.http.put(`${this.apiUrl}/update/${userId}`, updateData, {
      headers: this.getHeaders(),
      responseType: 'text' // Backend string döndürüyorsa
    }).pipe(
      catchError(error => {
        console.error('Kullanıcı güncellenirken hata oluştu:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        return throwError(() => error);
      })
    );
  }
  getAllUsers(): Observable<ListResponseModel<User>> {
    return this.http.get<ListResponseModel<User>>(this.userApiUrl + "/getall", {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Kullanıcılar alınırken hata oluştu:', error);
        return throwError(() => error);
      })
    );
  }
}
