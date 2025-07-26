import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../Services/ticket.service';
import { AuthService } from '../../Services/auth.service';
import { CreateTicketDto } from '../../Models/ticket';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit {
  ticketForm!: FormGroup;
  isSubmitting = false;
  isLoggedIn = false;
  currentUserId: number = 0;
  submitMessage = '';
  submitError = '';

  constructor(
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.createForm();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUserId = this.authService.getUserId() || 0;
    } else {
      this.router.navigate(['/login']);
    }
  }

  createForm(): void {
    this.ticketForm = this.formBuilder.group({
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  onSubmit(): void {
    if (this.ticketForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = '';
      this.submitMessage = '';

      const ticketData: CreateTicketDto = {
        subject: this.ticketForm.value.subject,
        message: this.ticketForm.value.message,
        userId: this.currentUserId
      };

      this.ticketService.createTicket(ticketData).subscribe({
        next: (response) => {
          if (response.success) {
            this.submitMessage = 'Destek talebiniz başarıyla oluşturuldu. Yönlendiriliyorsunuz...';
            setTimeout(() => {
              this.router.navigate(['/tickets']);
            }, 2000);
          } else {
            this.submitError = response.message || 'Ticket oluşturulurken bir hata oluştu.';
            this.isSubmitting = false;
          }
        },
        error: (error) => {
          console.error('Ticket oluşturma hatası:', error);
          this.submitError = 'Ticket oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.ticketForm.controls).forEach(key => {
      const control = this.ticketForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }

  // Validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.ticketForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.ticketForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${fieldName === 'subject' ? 'Konu' : 'Mesaj'} alanı zorunludur.`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${fieldName === 'subject' ? 'Konu' : 'Mesaj'} en az ${minLength} karakter olmalıdır.`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${fieldName === 'subject' ? 'Konu' : 'Mesaj'} en fazla ${maxLength} karakter olabilir.`;
      }
    }
    return '';
  }
}
