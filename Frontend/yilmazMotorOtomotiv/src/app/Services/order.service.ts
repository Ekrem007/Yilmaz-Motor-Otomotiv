import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDto } from '../Models/orderDto';
import { CreateOrderDto } from '../Models/createOrderDto';
import { OrderDetailDto } from '../Models/orderDetailDto';
import { OrderDetailsDto } from '../Models/OrderDetailsDto';
import { Observable } from 'rxjs';
import { ResponseModel } from '../Models/responseModel';
import { ListResponseModel } from '../Models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  apiUrl = 'https://localhost:7062/api/order';
  constructor(private httpClient: HttpClient) { }

   addOrder(order: CreateOrderDto): Observable<ResponseModel> {
     return this.httpClient.post<ResponseModel>(this.apiUrl + "/add", order);
   }
   
   getOrders(): Observable<ListResponseModel<OrderDto>> {
     return this.httpClient.get<ListResponseModel<OrderDto>>(this.apiUrl + "/getall");
   }

   getOrderDetailByOrderId(orderId: number): Observable<ListResponseModel<OrderDetailDto>> {
     return this.httpClient.get<ListResponseModel<OrderDetailDto>>(this.apiUrl + "/getOrderDetailByOrderId/" + orderId);
   }

   changeOrderStatus(orderId: number, status: string): Observable<ResponseModel> {
     // OrderStatus enum değerini number'a çevir
     let statusValue: number;
     switch (status) {
       case 'Pending': statusValue = 0; break;
       case 'Shipped': statusValue = 1; break;
       case 'Cancelled': statusValue = 2; break;
       default: statusValue = 0;
     }
     
     return this.httpClient.put<ResponseModel>(
       `${this.apiUrl}/changeOrderStatus/${orderId}?status=${statusValue}`, 
       {}
     );
   }

   getOrdersByUserId(userId: number): Observable<ListResponseModel<OrderDetailsDto>> {
     return this.httpClient.get<ListResponseModel<OrderDetailsDto>>(this.apiUrl + "/getOrdersByUserId/" + userId);
   }
}
