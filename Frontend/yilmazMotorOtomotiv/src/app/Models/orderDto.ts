import { OrderItemDto } from "./OrderItemDto";

export interface OrderDto {
  id: number;
  userId: number;
  totalAmount: number;
  orderDate: string;
  status: string;
  orderItems: OrderItemDto[];
}
