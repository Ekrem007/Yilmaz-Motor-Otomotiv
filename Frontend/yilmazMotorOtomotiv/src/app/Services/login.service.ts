import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LoginDto } from '../Models/loginDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private authService: AuthService) { }

  login(loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
}
