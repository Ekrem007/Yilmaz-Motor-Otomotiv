export interface UserTaskStatus {
  taskId: number;
  taskName: string;
  description: string;
  targetAmount: number;
  couponName: string;
  couponDiscountAmount: number;
  isCompleted: boolean;
  couponCode: string | null;
}

export interface UserTaskStatusResponse {
  success: boolean;
  message: string;
  data: UserTaskStatus[];
}
