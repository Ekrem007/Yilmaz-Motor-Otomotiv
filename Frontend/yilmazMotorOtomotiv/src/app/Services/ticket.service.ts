import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TicketDto, CreateTicketDto, CreateTicketReplyDto, TicketStatus } from '../Models/ticket';
import { ResponseModel } from '../Models/responseModel';
import { ListResponseModel } from '../Models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://localhost:7062/api/Ticket';
  private replyApiUrl = 'https://localhost:7062/api/TicketReply';

  constructor(private httpClient: HttpClient) { }

  // Ticket CRUD Operations
  getAllTickets(): Observable<ListResponseModel<TicketDto>> {
    return this.httpClient.get<ListResponseModel<TicketDto>>(`${this.apiUrl}/getAll`);
  }

  getTicketById(id: number): Observable<ResponseModel<TicketDto>> {
    return this.httpClient.get<ResponseModel<TicketDto>>(`${this.apiUrl}/getById/${id}`);
  }

  getTicketsByUserId(userId: number): Observable<ListResponseModel<TicketDto>> {
    return this.httpClient.get<ListResponseModel<TicketDto>>(`${this.apiUrl}/getByUserId/${userId}`);
  }

  createTicket(ticket: CreateTicketDto): Observable<ResponseModel<any>> {
    return this.httpClient.post<ResponseModel<any>>(`${this.apiUrl}/add`, ticket);
  }

  updateTicket(ticketId: number, ticket: any): Observable<ResponseModel<any>> {
    return this.httpClient.put<ResponseModel<any>>(`${this.apiUrl}/update/${ticketId}`, ticket);
  }

  deleteTicket(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.delete<ResponseModel<any>>(`${this.apiUrl}/delete/${id}`);
  }

  // Ticket Reply Operations
  getAllReplies(): Observable<ListResponseModel<any>> {
    return this.httpClient.get<ListResponseModel<any>>(`${this.replyApiUrl}/getAll`);
  }

  addReply(reply: CreateTicketReplyDto): Observable<ResponseModel<any>> {
    return this.httpClient.post<ResponseModel<any>>(`${this.replyApiUrl}/add`, reply);
  }
  getOpenedTickets(): Observable<ResponseModel<number>> {
    return this.httpClient.get<ResponseModel<number>>(`${this.apiUrl}/getOpenTicketCount`);
  }
  getClosedTickets(): Observable<ResponseModel<number>> {
    return this.httpClient.get<ResponseModel<number>>(`${this.apiUrl}/getClosedTicketCount`);
  }
  getAnsweredTickets(): Observable<ResponseModel<number>> {
    return this.httpClient.get<ResponseModel<number>>(`${this.apiUrl}/getAnsweredTicketCount`);
  }

  changeTicketStatus(ticketId: number, status: number): Observable<ResponseModel<any>> {
    return this.httpClient.put<ResponseModel<any>>(`${this.apiUrl}/changeStatus/${ticketId}`, status);
  }
  
  getTicketsByStatus(status: TicketStatus): Observable<ListResponseModel<TicketDto>> {
    return this.httpClient.get<ListResponseModel<TicketDto>>(`${this.apiUrl}/getTicketsByStatus/${status}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // 400 Bad Request ve belirli bir mesaj durumunda boş liste dön
          if (error.status === 400 && error.error?.message === 'No tickets found with the specified status') {
            return of({
              data: [],
              success: true,
              message: `${status} durumunda hiç talep bulunmamaktadır.`
            } as ListResponseModel<TicketDto>);
          }
          // Diğer hataları tekrar fırlat
          return throwError(() => error);
        })
      );
  }
  
}
