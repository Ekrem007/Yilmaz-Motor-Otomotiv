import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../Services/ticket.service';
import { AuthService } from '../../Services/auth.service';
import { TicketDto, TicketStatus } from '../../Models/ticket';
import { NavbarComponent } from '../navbar/navbar.component';

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
    private router: Router
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
      case TicketStatus.InProgress:
        return 'İşlemde';
      case TicketStatus.Closed:
        return 'Kapalı';
      case TicketStatus.Resolved:
        return 'Çözüldü';
      default:
        return 'Bilinmiyor';
    }
  }

  getStatusClass(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.Open:
        return 'bg-info';
      case TicketStatus.InProgress:
        return 'bg-warning';
      case TicketStatus.Closed:
        return 'bg-danger';
      case TicketStatus.Resolved:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  getPriorityClass(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.Open:
        return 'border-info';
      case TicketStatus.InProgress:
        return 'border-warning';
      case TicketStatus.Closed:
        return 'border-danger';
      case TicketStatus.Resolved:
        return 'border-success';
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

  getInProgressTickets(): number {
    return this.tickets.filter(t => t.status === TicketStatus.InProgress).length;
  }

  getResolvedTickets(): number {
    return this.tickets.filter(t => t.status === TicketStatus.Resolved).length;
  }
}
