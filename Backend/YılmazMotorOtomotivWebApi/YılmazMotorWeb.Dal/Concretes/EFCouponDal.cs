using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Dal.Context;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Dal.Concretes
{
	public class EFCouponDal : ICouponDal
	{
		private readonly YılmazMotorWebDbContext _context;

		public EFCouponDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}

		public void AddCoupon(Coupon coupon)
		{
			_context.Coupons.Add(coupon);
			_context.SaveChanges();
		}

		public void DeleteCoupon(int id)
		{
			var deleteCoupon = _context.Coupons.Find(id);
			if (deleteCoupon != null)
			{
				_context.Coupons.Remove(deleteCoupon);
				_context.SaveChanges();
			}
			else
			{
				throw new Exception("Coupon not found");
			}
		}

		public List<Coupon> GetAllCoupons()
		{
			var coupons = _context.Coupons.ToList();
			if (coupons == null || !coupons.Any())
			{
				throw new Exception("No coupons found");
			}
			return coupons;
		}

		public Coupon GetCouponById(int id)
		{
			var coupon = _context.Coupons.Find(id);
			if (coupon == null)
			{
				throw new Exception("Coupon not found");
			}
			return coupon;
		}

		public void UpdateCoupon(Coupon coupon, int couponId)
		{
			var existingCoupon = _context.Coupons.Find(couponId);
			if (existingCoupon != null)
			{
				existingCoupon.CouponName = coupon.CouponName;
				existingCoupon.DiscountAmount = coupon.DiscountAmount;
				_context.SaveChanges();
			}
			else
			{
				throw new Exception("Coupon not found");
			}
		}

		public List<Coupon> GetCouponsByName(string name)
		{
			var coupons = _context.Coupons
				.Where(c => c.CouponName.ToLower().Contains(name.ToLower()))
				.ToList();
			return coupons;
		}
	}
}