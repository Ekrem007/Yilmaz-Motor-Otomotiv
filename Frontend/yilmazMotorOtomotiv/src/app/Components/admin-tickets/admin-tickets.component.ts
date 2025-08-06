import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../Services/ticket.service';
import { AuthService } from '../../Services/auth.service';
import { TicketDto, TicketStatus } from '../../Models/ticket';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-tickets.component.html',
  styleUrls: ['./admin-tickets.component.css']
})
export class AdminTicketsComponent implements OnInit {
  tickets: TicketDto[] = [];
  isLoading = false;
  isAdmin = false;
  TicketStatus = TicketStatus;
  selectedStatus: TicketStatus | null = null;

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
    
    // Durum seçiliyse ona göre filtrele
    if (this.selectedStatus !== null) {
      this.loadTicketsByStatus(this.selectedStatus);
      return;
    }
    
    // Değilse tüm ticketları getir
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
        this.toastrService.error('Ticketlar yüklenirken bir hata oluştu.');
      }
    });
  }
  
  loadTicketsByStatus(status: TicketStatus): void {
    this.isLoading = true;
    this.selectedStatus = status;
    
    this.ticketService.getTicketsByStatus(status).subscribe({
      next: (response) => {
        if (response.success) {
          this.tickets = response.data || [];
          if (this.tickets.length > 0) {
            this.toastrService.success(`${this.getStatusText(status)} durumundaki talepler listelendi.`);
          } else {
            this.toastrService.info(`${this.getStatusText(status)} durumunda hiç talep bulunmamaktadır.`);
          }
        } else {
          this.toastrService.error('Talepler yüklenirken bir hata oluştu.');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ticketlar duruma göre yüklenirken hata:', error);
        this.isLoading = false;
        
        // 400 Bad Request hatası - muhtemelen o durumda hiç talep yok
        if (error.status === 400 && error.error && error.error.message === 'No tickets found with the specified status') {
          // Bu durumu başarılı bir sonuç olarak ele alıp boş bir liste göstereceğiz
          this.tickets = [];
          this.toastrService.info(`${this.getStatusText(status)} durumunda hiç talep bulunmamaktadır.`);
        } else {
          this.toastrService.error('Talep filtreleme sırasında bir hata oluştu.');
        }
      }
    });
  }

  viewTicket(ticketId: number): void {
    this.router.navigate(['/tickets', ticketId]);
  }

  getStatusText(status: TicketStatus | null): string {
    if (status === null) {
      return 'Tüm Talepler';
    }
    
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

  getStatusClass(status: TicketStatus | null): string {
    if (status === null) {
      return 'bg-primary';
    }
    
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
