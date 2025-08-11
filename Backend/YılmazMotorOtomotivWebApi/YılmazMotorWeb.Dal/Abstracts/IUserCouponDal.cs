using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface IUserCouponCodeDal
	{
		void AddUserCouponCode(UserCouponCode userCouponCode);
		List<UserCouponCode> GetAllUserCouponCodes();
		UserCouponCodeDto GetUserCouponCodeById(int id);
		List<UserCouponCode> GetUserCouponCodesByUserId(int userId);
		void UpdateUserCouponCode(int id);
		UserCouponCode GetUserCouponCodeByCode(Guid couponCode);

	}
}