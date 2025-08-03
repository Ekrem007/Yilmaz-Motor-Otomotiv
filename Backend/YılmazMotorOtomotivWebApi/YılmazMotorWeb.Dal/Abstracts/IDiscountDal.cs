using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface IDiscountDal
	{
		void AddDiscount(Discount discount);
		void UpdateDiscount(Discount discount, int discountId);
		void DeleteDiscount(int discountId);
		Discount GetDiscountById(int discountId);
		List<DiscountedProdutDto> GetAllDiscounts();
	}
}
