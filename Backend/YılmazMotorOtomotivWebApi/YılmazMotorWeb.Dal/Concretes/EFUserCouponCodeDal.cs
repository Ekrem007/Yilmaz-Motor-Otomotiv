using Microsoft.EntityFrameworkCore;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Dal.Context;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Concretes
{
	public class EFUserCouponCodeDal : IUserCouponCodeDal
	{
		private readonly YılmazMotorWebDbContext _context;

		public EFUserCouponCodeDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}

		public void AddUserCouponCode(UserCouponCode userCouponCode)
		{
			_context.UserCouponCodes.Add(userCouponCode);
			_context.SaveChanges();
		}
		public List<UserCouponCode> GetAllUserCouponCodes()
		{
			var userCouponCodes = _context.UserCouponCodes
				.Include(ucc => ucc.User)
				.Include(ucc => ucc.Coupon)
				.ToList();

			if (userCouponCodes == null || !userCouponCodes.Any())
			{
				throw new Exception("No user coupon codes found");
			}
			return userCouponCodes;
		}

		public UserCouponCodeDto GetUserCouponCodeById(int id)
		{
			var userCouponCode = _context.UserCouponCodes
				.Include(ucc => ucc.User)
				.Include(ucc => ucc.Coupon)
				.FirstOrDefault(ucc => ucc.Id == id);
			if (userCouponCode == null)
			{
				throw new Exception($"User coupon code with ID {id} not found");
			}
			return new UserCouponCodeDto
			{
				Id = userCouponCode.Id,
				UserId = userCouponCode.UserId,
				CouponCode = userCouponCode.CouponCode,
				CouponId = userCouponCode.CouponId,
				IsUsed = userCouponCode.IsUsed,
				DiscountAmount = userCouponCode.Coupon.DiscountAmount,
				UsedDate = userCouponCode.UsedDate
			};
		}



		public List<UserCouponCode> GetUserCouponCodesByUserId(int userId)
		{
			var userCouponCodes = _context.UserCouponCodes
				.Include(ucc => ucc.Coupon)
				.Where(ucc => ucc.UserId == userId)
				.OrderByDescending(ucc => ucc.Id)
				.ToList();

			return userCouponCodes;
		}
		public void UpdateUserCouponCode(int id)
		{
			var userCouponCode = _context.UserCouponCodes.FirstOrDefault(ucc => ucc.Id == id);
			if (userCouponCode == null)
			{
				throw new Exception($"User coupon code with ID {id} not found");
			}
			userCouponCode.IsUsed = true;
			userCouponCode.UsedDate = DateTime.Now;
			_context.UserCouponCodes.Update(userCouponCode);
			_context.SaveChanges();
		}
		public UserCouponCode GetUserCouponCodeByCode(Guid couponCode)
		{
			return _context.UserCouponCodes.Include(x => x.Coupon).FirstOrDefault(x => x.CouponCode == couponCode);
		}

	}
}