using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface IProductReviewDal
	{
		void AddReview(ProductReview review);
		void UpdateReview(ProductReview review,int productReviewId);
		void DeleteReview(int id);
		ProductReview GetReviewById(int id);
		List<ProductReviewDto> GetAllReviews();
	}
}
