export interface DiscountedProductDto {
  productId: number;
  productName: string;
  categoryName: string;
  productStock: number;
  productDescription: string;
  originalPrice: number;
  discountRate: number;
  discountedPrice: number;
  imageUrl: string;
  stock: number;
  discountStartDate: string;
  discountEndDate: string;
}
