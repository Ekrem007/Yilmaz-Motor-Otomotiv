import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketDto, CreateTicketDto, CreateTicketReplyDto } from '../Models/ticket';
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
}
