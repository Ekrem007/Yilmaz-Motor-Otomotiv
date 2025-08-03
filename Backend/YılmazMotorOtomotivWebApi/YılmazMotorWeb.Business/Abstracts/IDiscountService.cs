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
	public interface IDiscountService
	{
		IDataResult<List<DiscountedProdutDto>> GetAllDiscounts();
		IDataResult<Discount> GetDiscountById(int id);
		IDataResult<Discount> AddDiscount(Discount discount);
		IResult UpdateDiscount(Discount discount, int discountId);
		IResult DeleteDiscount(int discountId);
	}
}
