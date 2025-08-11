using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface ICouponService
	{
		IDataResult<List<Coupon>> GetAllCoupons();
		IDataResult<Coupon> GetCouponById(int id);
		IDataResult<Coupon> AddCoupon(Coupon coupon);
		IResult UpdateCoupon(Coupon coupon, int couponId);
		IResult DeleteCoupon(int couponId);
		IDataResult<List<Coupon>> GetCouponsByName(string name);
	}
}
