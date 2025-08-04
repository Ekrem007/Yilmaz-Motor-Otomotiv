import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../Services/ticket.service';
import { AuthService } from '../../Services/auth.service';
import { TicketDto, TicketStatus } from '../../Models/ticket';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  tickets: TicketDto[] = [];
  isLoading = false;
  isLoggedIn = false;
  currentUserId: number = 0;
  TicketStatus = TicketStatus;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.loadUserTickets();
    }
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUserId = this.authService.getUserId() || 0;
    }
  }

  loadUserTickets(): void {
    this.isLoading = true;
    this.ticketService.getTicketsByUserId(this.currentUserId).subscribe({
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

  createNewTicket(): void {
    this.router.navigate(['/tickets/create']);
  }

  viewTicket(ticketId: number): void {
    this.router.navigate(['/tickets', ticketId]);
  }

  getStatusText(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.Open:
        return 'Açık';
      case TicketStatus.Open:
        return 'İşlemde';
      case TicketStatus.Closed:
        return 'Kapalı';
      case TicketStatus.Answered:
        return 'Cevaplandı';
      default:
        return 'Bilinmiyor';
    }
  }

  getStatusClass(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.Open:
        return 'bg-info';
      case TicketStatus.Open:
        return 'bg-warning';
      case TicketStatus.Closed:
        return 'bg-danger';
      case TicketStatus.Answered:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('tr-TR');
  }
}
