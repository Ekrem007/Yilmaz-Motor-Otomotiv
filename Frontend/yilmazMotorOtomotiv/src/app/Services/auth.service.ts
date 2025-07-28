import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { LoginDto, LoginResponse } from '../Models/loginDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7062/api/Auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private userRoleSubject = new BehaviorSubject<number | null>(null);
  public userRole$ = this.userRoleSubject.asObservable();
  
  private userIdSubject = new BehaviorSubject<number | null>(null);
  public userId$ = this.userIdSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Constructor'da localStorage okuma yapma - her açılışta temiz başlangıç
  }

  // Uygulama başlangıcında çağrılacak metod
  clearStorageOnAppStart(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isLoggedIn');
    }
    this.currentUserSubject.next(null);
    this.userIdSubject.next(null);
    this.userRoleSubject.next(null);
  }

  // Mevcut oturumu kontrol et ve geri yükle (gerekirse)
  restoreSession(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const currentUser = localStorage.getItem('currentUser');
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');

      if (isLoggedIn === 'true' && currentUser && userId && userRole) {
        this.currentUserSubject.next(JSON.parse(currentUser));
        this.userIdSubject.next(parseInt(userId));
        this.userRoleSubject.next(parseInt(userRole));
        return parseInt(userId); // Cart için kullanıcı ID'sini döndür
      }
    }
    return null;
  }

  login(loginData: LoginDto): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData, { 
      headers
    })
      .pipe(
        map(response => {
          // Backend'den gelen response: { message, userId, roleId }
          // Başarılı giriş durumunda kullanıcı bilgilerini kaydet
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(loginData.userName));
            localStorage.setItem('userId', response.userId.toString());
            localStorage.setItem('userRole', response.roleId.toString());
            localStorage.setItem('isLoggedIn', 'true');
          }
          
          this.currentUserSubject.next(loginData.userName);
          this.userIdSubject.next(response.userId);
          this.userRoleSubject.next(response.roleId);
          
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Giriş yapılırken bir hata oluştu!';
          
          console.log('Login error:', error); // Debug için
          
          try {
            // Error response'u güvenli bir şekilde parse et
            if (error.error) {
              if (typeof error.error === 'string') {
                // Error response string ise
                if (error.error.includes('Invalid') || error.error.includes('invalid')) {
                  errorMessage = 'Kullanıcı adı veya şifre hatalı!';
                } else {
                  errorMessage = error.error;
                }
              } else if (error.error.message) {
                // Error response object ise ve message property'si varsa
                errorMessage = error.error.message;
              } else if (error.error.title) {
                // Bazı API'lar title field'ı kullanır
                errorMessage = error.error.title;
              }
            }
          } catch (parseError) {
            console.log('Error parsing error response:', parseError);
            // Parse hatası durumunda HTTP status koduna göre mesaj ver
          }
          
          // HTTP status kodlarına göre fallback mesajlar
          if (error.status === 401 || error.status === 400) {
            errorMessage = 'Kullanıcı adı veya şifre hatalı!';
          } else if (error.status === 404) {
            errorMessage = 'Kullanıcı bulunamadı!';
          } else if (error.status === 500) {
            errorMessage = 'Sunucu hatası! Lütfen daha sonra tekrar deneyin.';
          } else if (error.status === 0) {
            errorMessage = 'Sunucuya bağlanılamıyor! İnternet bağlantınızı kontrol edin.';
          }
          
          return throwError(() => ({ message: errorMessage }));
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isLoggedIn');
    }
    this.currentUserSubject.next(null);
    this.userIdSubject.next(null);
    this.userRoleSubject.next(null);
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getUserRole(): number | null {
    return this.userRoleSubject.value;
  }

  getUserId(): number | null {
    return this.userIdSubject.value;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 1;
  }

  isUser(): boolean {
    return this.getUserRole() === 2;
  }
}
