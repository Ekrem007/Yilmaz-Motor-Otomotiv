using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Business.Concretes
{
	public class CouponService : ICouponService
	{
		private readonly ICouponDal _couponDal;

		public CouponService(ICouponDal couponDal)
		{
			_couponDal = couponDal;
		}

		public IDataResult<Coupon> AddCoupon(Coupon coupon)
		{
			if (coupon == null)
			{
				return new ErrorDataResult<Coupon>("Coupon cannot be null");
			}
			_couponDal.AddCoupon(coupon);
			return new SuccessDataResult<Coupon>(coupon, "Coupon added successfully");
		}

		public IResult DeleteCoupon(int couponId)
		{
			if (couponId <= 0)
			{
				return new ErrorResult("Invalid coupon ID");
			}
			_couponDal.DeleteCoupon(couponId);
			return new SuccessResult("Coupon deleted successfully");
		}

		public IDataResult<List<Coupon>> GetAllCoupons()
		{
			var coupons = _couponDal.GetAllCoupons();
			if (coupons == null || !coupons.Any())
			{
				return new ErrorDataResult<List<Coupon>>("No coupons found");
			}
			return new SuccessDataResult<List<Coupon>>(coupons, "Coupons retrieved successfully");
		}

		public IDataResult<Coupon> GetCouponById(int id)
		{
			if (id <= 0)
			{
				return new ErrorDataResult<Coupon>("Invalid coupon ID");
			}
			var coupon = _couponDal.GetCouponById(id);
			if (coupon == null)
			{
				return new ErrorDataResult<Coupon>("Coupon not found");
			}
			return new SuccessDataResult<Coupon>(coupon, "Coupon retrieved successfully");
		}

		public IDataResult<List<Coupon>> GetCouponsByName(string name)
		{
			if (string.IsNullOrWhiteSpace(name))
			{
				return new ErrorDataResult<List<Coupon>>("Coupon name cannot be empty");
			}
			var coupons = _couponDal.GetCouponsByName(name);
			if (coupons == null || !coupons.Any())
			{
				return new ErrorDataResult<List<Coupon>>("No coupons found with the specified name");
			}
			return new SuccessDataResult<List<Coupon>>(coupons, "Coupons retrieved successfully");
		}

		public IResult UpdateCoupon(Coupon coupon, int couponId)
		{
			if (coupon == null)
			{
				return new ErrorResult("Coupon cannot be null");
			}
			if (couponId <= 0)
			{
				return new ErrorResult("Invalid coupon ID");
			}

			var existingCoupon = _couponDal.GetCouponById(couponId);
			if (existingCoupon == null)
			{
				return new ErrorResult("Coupon not found");
			}

			existingCoupon.CouponName = coupon.CouponName;
			existingCoupon.DiscountAmount = coupon.DiscountAmount;

			_couponDal.UpdateCoupon(existingCoupon, couponId);
			return new SuccessResult("Coupon updated successfully");
		}

	}
}

