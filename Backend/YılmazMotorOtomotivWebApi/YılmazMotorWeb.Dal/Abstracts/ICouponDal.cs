using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface ICouponDal
	{
		void AddCoupon(Coupon coupon);
		void UpdateCoupon(Coupon coupon, int couponId);
		void DeleteCoupon(int id);
		List<Coupon> GetAllCoupons();
		Coupon GetCouponById(int id);
		List<Coupon> GetCouponsByName(string name);
	}
}
