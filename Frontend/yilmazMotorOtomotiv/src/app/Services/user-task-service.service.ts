import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserTaskStatusResponse } from '../Models/userTask';

@Injectable({
  providedIn: 'root'
})
export class UserTaskServiceService {
  private apiUrl = "https://localhost:7062/api/UserTask";

  constructor(private http: HttpClient) { }
  
  getUserTaskStatus(userId: number): Observable<UserTaskStatusResponse> {
    return this.http.get<UserTaskStatusResponse>(`${this.apiUrl}/getUserTaskStatus/${userId}`);
  }
}
