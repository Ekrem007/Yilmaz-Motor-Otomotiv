import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../Services/ticket.service';
import { AuthService } from '../../Services/auth.service';
import { TicketDto, TicketStatus, CreateTicketReplyDto } from '../../Models/ticket';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
  ticket: TicketDto | null = null;
  replyForm!: FormGroup;
  isLoading = false;
  isSubmittingReply = false;
  isLoggedIn = false;
  currentUserId: number = 0;
  isAdmin = false;
  ticketId: number = 0;
  submitMessage = '';
  submitError = '';
  TicketStatus = TicketStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.getTicketId();
    this.createReplyForm();
    if (this.isLoggedIn) {
      this.loadTicket();
    }
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUserId = this.authService.getUserId() || 0;
      this.isAdmin = this.authService.isAdmin();
    } else {
      this.router.navigate(['/login']);
    }
  }

  getTicketId(): void {
    this.route.params.subscribe(params => {
      this.ticketId = +params['id'];
    });
  }

  createReplyForm(): void {
    this.replyForm = this.formBuilder.group({
      replyMessage: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]]
    });
  }

  loadTicket(): void {
    this.isLoading = true;
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.ticket = response.data;
          // Kullanıcı sadece kendi ticket'ını görebilir (admin hariç)
          if (!this.isAdmin && this.ticket?.userId !== this.currentUserId) {
            this.router.navigate(['/tickets']);
            return;
          }
        } else {
          this.router.navigate(['/tickets']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ticket yüklenirken hata:', error);
        this.router.navigate(['/tickets']);
        this.isLoading = false;
      }
    });
  }

  onSubmitReply(): void {
    if (this.replyForm.valid && !this.isSubmittingReply && this.ticket) {
      this.isSubmittingReply = true;
      this.submitError = '';
      this.submitMessage = '';

      const replyData: CreateTicketReplyDto = {
        ticketId: this.ticket.id,
        replyMessage: this.replyForm.value.replyMessage,
        userId: this.currentUserId
      };

      this.ticketService.addReply(replyData).subscribe({
        next: (response) => {
          if (response.success) {
            this.submitMessage = 'Cevabınız başarıyla gönderildi.';
            this.replyForm.reset();
            // Ticket'ı yeniden yükle
            setTimeout(() => {
              this.loadTicket();
              this.submitMessage = '';
            }, 2000);
          } else {
            this.submitError = response.message || 'Cevap gönderilirken bir hata oluştu.';
          }
          this.isSubmittingReply = false;
        },
        error: (error) => {
          console.error('Cevap gönderme hatası:', error);
          this.submitError = 'Cevap gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
          this.isSubmittingReply = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.replyForm.controls).forEach(key => {
      const control = this.replyForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }

  getStatusText(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.Open:
        return 'Açık';
      case TicketStatus.Answered:
        return 'Cevaplandı';
      case TicketStatus.Closed:
        return 'Kapalı';
      default:
        return 'Bilinmiyor';
    }
  }

  getStatusClass(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.Open:
        return 'bg-info';
      case TicketStatus.Answered:
        return 'bg-warning';
      case TicketStatus.Closed:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('tr-TR');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.replyForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.replyForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return 'Cevap alanı zorunludur.';
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Cevap en az ${minLength} karakter olmalıdır.`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `Cevap en fazla ${maxLength} karakter olabilir.`;
      }
    }
    return '';
  }

  canReply(): boolean {
    return this.ticket?.status !== TicketStatus.Closed;
  }
  
  changeStatus(status: number): void {
    if (!this.ticket || !this.isAdmin) {
      return;
    }

    this.isLoading = true;
    this.ticketService.changeTicketStatus(this.ticket.id, status).subscribe({
      next: (response) => {
        if (response.success) {
          // Güncellenmiş durumu yerel nesnede güncelle
          if (this.ticket) {
            this.ticket.status = status;
          }
          // Güncellenen durumu göster ve veriyi yeniden yükle
          this.loadTicket();
          this.submitMessage = 'Talep durumu başarıyla güncellendi.';
          setTimeout(() => {
            this.submitMessage = '';
          }, 3000);
        } else {
          this.submitError = response.message || 'Talep durumu güncellenirken bir hata oluştu.';
          setTimeout(() => {
            this.submitError = '';
          }, 3000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Durum değiştirme hatası:', error);
        this.submitError = 'Talep durumu güncellenirken bir hata oluştu. Lütfen tekrar deneyin.';
        setTimeout(() => {
          this.submitError = '';
        }, 3000);
        this.isLoading = false;
      }
    });
  }
}
