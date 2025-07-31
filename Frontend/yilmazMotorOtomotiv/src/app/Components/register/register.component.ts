
import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { RegisterDto } from '../../Models/registerDto';
import { Router } from '@angular/router';
import { LoginDto } from '../../Models/loginDto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: RegisterDto = {
    username: '',
    email: '',
    password: '',
    name: '',
    surname: '',
    phoneNumber: '',
    address: ''
  };
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;
    this.authService.register(this.registerData).subscribe({
      next: (_res) => {
        // Kayıt başarılı, şimdi otomatik login yap
        const loginData: LoginDto = {
          userName: this.registerData.username,
          password: this.registerData.password
        };
        this.authService.login(loginData).subscribe({
          next: () => {
            this.loading = false;
            this.successMessage = 'Kayıt ve giriş başarılı! Yönlendiriliyorsunuz...';
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);
          },
          error: (err) => {
            this.loading = false;
            this.errorMessage = 'Kayıt başarılı ancak otomatik giriş yapılamadı: ' + (err?.message || 'Hata oluştu.');
          }
        });
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || err?.message || 'Kayıt sırasında hata oluştu!';
        this.loading = false;
      }
    });
  }
}
