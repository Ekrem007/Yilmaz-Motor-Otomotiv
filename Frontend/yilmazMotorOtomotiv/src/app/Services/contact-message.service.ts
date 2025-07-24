import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponseModel } from '../Models/listResponseModel';
import { Communication } from '../Models/communication';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactMessageServiceService {

  constructor(private httpClient: HttpClient) { }
  apiUrl = 'https://localhost:7062/api/ContactMessage';

  getContactMessages(): Observable<ListResponseModel<Communication>> {
    return this.httpClient.get<ListResponseModel<Communication>>(this.apiUrl + '/getall');
  }
  addContactMessage(contactMessage: Communication): Observable<Communication> {
    return this.httpClient.post<Communication>(this.apiUrl + '/add', contactMessage);
  }
  updateContactMessage(contactMessage: Communication, messageId: number): Observable<Communication> {
    return this.httpClient.put<Communication>(this.apiUrl + '/update/' + messageId, contactMessage);
  }
  deleteContactMessage(messageId: number): Observable<Communication> {
    return this.httpClient.delete<Communication>(this.apiUrl + '/delete/' + messageId);
  }



}
