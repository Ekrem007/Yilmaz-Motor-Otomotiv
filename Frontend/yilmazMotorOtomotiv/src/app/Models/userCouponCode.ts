export interface UserCouponCode {
  id: number;
  userId: number;
  code: string;
  discountAmount: number;
  isUsed: boolean;
  expiryDate?: Date;
}
