import { CreateOrderItemDto } from './createOrderItemDto';

export interface CreateOrderDto {
  userId: number;
  totalAmount: number;
  orderItems: CreateOrderItemDto[];
  couponCode?: string; // Nullable kupon kodu
  couponId?: number; // Opsiyonel - Kullanılan kupon ID'si
  discountAmount?: number; // Opsiyonel - Uygulanan indirim miktarı
}
