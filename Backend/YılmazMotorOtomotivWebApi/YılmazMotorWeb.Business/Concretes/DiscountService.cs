using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Dal.Concretes;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Concretes
{
	public class DiscountService : IDiscountService
	{
		private readonly IDiscountDal _discountDal;

		public DiscountService(IDiscountDal discountDal)
		{
			_discountDal = discountDal;
		}

		public IDataResult<Discount> AddDiscount(Discount discount)
		{
			if (discount == null)
			{
				throw new ArgumentNullException(nameof(discount), "Discount cannot be null");
			}

			try
			{
				_discountDal.AddDiscount(discount);
				return new DataResult<Discount>(discount, true, "Discount added successfully");
			}
			catch (InvalidOperationException ex)
			{
				return new DataResult<Discount>(null, false, ex.Message);
			}
			catch (Exception ex)
			{
				return new DataResult<Discount>(null, false, "An error occurred while adding discount: " + ex.Message);
			}
		}

		public IResult DeleteDiscount(int discountId)
		{
			if (discountId <= 0)
			{
				return new Result(false, "Invalid discount ID");
			}
			_discountDal.DeleteDiscount(discountId);
			return new Result(true, "Discount deleted successfully");
		}

		public IDataResult<List<DiscountedProdutDto>> GetAllDiscounts()
		{
			var discounts = _discountDal.GetAllDiscounts();
			if (discounts == null || !discounts.Any())
			{
				return new DataResult<List<DiscountedProdutDto>>(null, false, "No discounts found");
			}
			return new DataResult<List<DiscountedProdutDto>>(discounts, true, "Discounts retrieved successfully");
		}

		public IDataResult<Discount> GetDiscountById(int id)
		{
			if (id <= 0)
			{
				return new DataResult<Discount>(null, false, "Invalid discount ID");
			}
			var discount = _discountDal.GetDiscountById(id);
			if (discount == null)
			{
				return new DataResult<Discount>(null, false, "Discount not found");
			}
			return new DataResult<Discount>(discount, true, "Discount retrieved successfully");
		}

		public IResult UpdateDiscount(Discount discount, int discountId)
		{
			if (discount == null)
			{
				throw new ArgumentNullException(nameof(discount), "Discount cannot be null");
			}
			if (discountId <= 0)
			{
				return new Result(false, "Invalid discount ID");
			}
			_discountDal.UpdateDiscount(discount, discountId);
			return new Result(true, "Discount updated successfully");
		}
		public IDataResult<DiscountedProdutDto> GetDiscountedProdut(int discountId)
		{
			if (discountId <= 0)
			{
				return new DataResult<DiscountedProdutDto>(null, false, "Invalid discount ID");
			}
			var discountedProduct = _discountDal.GetDiscountedProdut(discountId);
			if (discountedProduct == null)
			{
				return new DataResult<DiscountedProdutDto>(null, false, "Discounted product not found");
			}
			return new DataResult<DiscountedProdutDto>(discountedProduct, true, "Discounted product retrieved successfully");
		}
	}
}
