import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../Services/ticket.service';
import { AuthService } from '../../Services/auth.service';
import { TicketDto, TicketStatus } from '../../Models/ticket';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './admin-tickets.component.html',
  styleUrls: ['./admin-tickets.component.css']
})
export class AdminTicketsComponent implements OnInit {
  tickets: TicketDto[] = [];
  isLoading = false;
  isAdmin = false;
  TicketStatus = TicketStatus;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.checkAdminStatus();
    if (this.isAdmin) {
      this.loadAllTickets();
    }
  }

  checkAdminStatus(): void {
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) {
      this.router.navigate(['/']);
    }
  }

  loadAllTickets(): void {
    this.isLoading = true;
    this.ticketService.getAllTickets().subscribe({
      next: (response) => {
        if (response.success) {
          this.tickets = response.data || [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ticketlar yüklenirken hata:', error);
        this.isLoading = false;
      }
    });
  }

  viewTicket(ticketId: number): void {
    this.router.navigate(['/tickets', ticketId]);
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

  getPriorityClass(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.Open:
        return 'border-info';
      case TicketStatus.Answered:
        return 'border-warning';
      case TicketStatus.Closed:
        return 'border-danger';
      default:
        return 'border-secondary';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('tr-TR');
  }

  getTicketsByStatus(status: TicketStatus): TicketDto[] {
    return this.tickets.filter(ticket => ticket.status === status);
  }

  getTotalTickets(): number {
    return this.tickets.length;
  }

  getOpenTickets(): number {
    return this.tickets.filter(t => t.status === TicketStatus.Open).length;
  }

  getAnsweredTickets(): number {
    return this.tickets.filter(t => t.status === TicketStatus.Answered).length;
  }

  getClosedTickets(): number {
    return this.tickets.filter(t => t.status === TicketStatus.Closed).length;
  }
  
  changeTicketStatus(ticketId: number, status: number): void {
  const ticket = this.tickets.find(t => t.id === ticketId);
  if (!ticket) return;
  if (ticket.status === status) return;
  this.isLoading = true;

  this.ticketService.changeTicketStatus(ticketId, status).subscribe({
    next: (response: any) => {
      this.isLoading = false;
      
      // Yanıt yapısını kontrol et ve güvenli bir şekilde işle
      if (response && response.success === true) {
        // Başarılı yanıt - bileti güncelle ve bildir
        ticket.status = status as TicketStatus;
        this.toastrService.success(`Talep durumu başarıyla güncellendi: ${this.getStatusText(status as TicketStatus)}`);
      } else {
        // Sunucudan hata yanıtı
        const errorMessage = response && response.message 
          ? response.message 
          : 'Talep durumu güncellenirken bir hata oluştu';
        this.toastrService.error(errorMessage);
      }
    },
    error: (error) => {
      this.toastrService.error('Talep durumu güncellenemedi. Bir hata oluştu.');
      this.isLoading = false;
    }
  });
}
}
