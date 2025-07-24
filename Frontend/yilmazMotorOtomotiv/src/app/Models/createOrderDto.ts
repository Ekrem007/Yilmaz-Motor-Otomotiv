import { CreateOrderItemDto } from './createOrderItemDto';

export interface CreateOrderDto {
  userId: number;
  totalAmount: number;
  orderItems: CreateOrderItemDto[];
}
