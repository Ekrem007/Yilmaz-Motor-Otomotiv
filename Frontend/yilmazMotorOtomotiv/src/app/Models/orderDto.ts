import { OrderItemDto } from "./OrderItemDto";

export interface OrderDto {
  id: number;
  userId: number;
  totalAmount: number;
  orderDate: string;
  status: string;
  couponCode?: string; // Nullable kupon kodu
  orderItems: OrderItemDto[];
}
