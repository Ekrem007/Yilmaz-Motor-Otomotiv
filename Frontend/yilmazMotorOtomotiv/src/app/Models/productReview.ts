export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  reviewText: string;
  rating: number;
  createdAt: Date;
  productName: string;
  userName: string;
}

export interface CreateProductReviewDto {
  productId: number;
  userId: number;
  reviewText: string;
  rating: number;
}
