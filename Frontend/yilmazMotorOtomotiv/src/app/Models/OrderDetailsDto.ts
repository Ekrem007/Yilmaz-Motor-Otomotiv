export interface OrderDetailsDto {
  orderId: number;
  userName: string;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number; 
  totalAmount: number;
  status: string;
  orderDate: string;
}