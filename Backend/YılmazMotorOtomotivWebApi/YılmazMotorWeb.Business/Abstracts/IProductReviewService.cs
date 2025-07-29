using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface IProductReviewService
	{
		IDataResult<List<ProductReviewDto>> GetAll();

		IDataResult<ProductReview> GetById(int id);

		IDataResult<ProductReview> Add(ProductReview productReview);
		IResult Update(ProductReview productReview, int productReviewId);
		IResult Delete(int productReviewId);
		IDataResult<TopRatedProductDto> GetTopRatedProduct();
	}
}
