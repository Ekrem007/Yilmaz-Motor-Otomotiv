using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Concretes
{
	public class ProductReviewService : IProductReviewService
	{
		private readonly IProductReviewDal _productReviewDal;
		public ProductReviewService(IProductReviewDal productReviewDal)
		{
			_productReviewDal = productReviewDal;
		}
		public IDataResult<ProductReview> Add(ProductReview productReview)
		{
			_productReviewDal.AddReview(productReview);
			return new SuccessDataResult<ProductReview>(productReview, "Product review added successfully");
		}

		public IResult Delete(int productReviewId)
		{
			_productReviewDal.DeleteReview(productReviewId);
			return new SuccessResult("Product review deleted successfully");
		}

		public IDataResult<List<ProductReviewDto>> GetAll()
		{
			var reviews = _productReviewDal.GetAllReviews();
			if (reviews == null || !reviews.Any())
			{
				return new ErrorDataResult<List<ProductReviewDto>>("No product reviews found");
			}
			return new SuccessDataResult<List<ProductReviewDto>>(reviews, "Product reviews retrieved successfully");
		}

		public IDataResult<ProductReview> GetById(int id)
		{
			var review = _productReviewDal.GetReviewById(id);
			if (review == null)
			{
				return new ErrorDataResult<ProductReview>($"Product review with ID {id} not found");
			}
			return new SuccessDataResult<ProductReview>(review, "Product review retrieved successfully");
		}

		public IResult Update(ProductReview productReview, int productReviewId)
		{
			if (productReview == null)
			{
				return new ErrorResult("Product review cannot be null");
			}
			_productReviewDal.UpdateReview(productReview, productReviewId);
			return new SuccessResult("Product review updated successfully");
		}
		public IDataResult<TopRatedProductDto> GetTopRatedProduct()
		{
			var topRatedProduct = _productReviewDal.GetTopRatedProduct();
			if (topRatedProduct == null)
			{
				return new ErrorDataResult<TopRatedProductDto>("No top-rated product found");
			}
			return new SuccessDataResult<TopRatedProductDto>(topRatedProduct, "Top-rated product retrieved successfully");
		}
	}
}
