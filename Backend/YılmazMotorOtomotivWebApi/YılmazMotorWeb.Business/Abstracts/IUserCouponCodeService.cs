using System.Collections.Generic;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface IUserCouponCodeService
	{
		IResult AddUserCouponCode(UserCouponCode userCouponCode);
		IDataResult<List<UserCouponCode>> GetAllUserCouponCodes();
		IDataResult<UserCouponCodeDto> GetUserCouponCodeById(int id);
		IDataResult<List<UserCouponCode>> GetUserCouponCodesByUserId(int userId);
		IResult MarkkUsedCouponCode(int id);
		IDataResult<UserCouponCode> GetUserCouponCodeByCode(Guid couponCode);
	}
}