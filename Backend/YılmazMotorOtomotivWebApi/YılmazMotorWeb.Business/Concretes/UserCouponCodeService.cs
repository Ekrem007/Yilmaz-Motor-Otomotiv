using System.Collections.Generic;
using System.Linq;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Concretes
{
	public class UserCouponCodeService : IUserCouponCodeService
	{
		private readonly IUserCouponCodeDal _userCouponCodeDal;

		public UserCouponCodeService(IUserCouponCodeDal userCouponCodeDal)
		{
			_userCouponCodeDal = userCouponCodeDal;
		}

		public IResult AddUserCouponCode(UserCouponCode userCouponCode)
		{
			if (userCouponCode == null)
				return new ErrorResult("Coupon code cannot be null");

			_userCouponCodeDal.AddUserCouponCode(userCouponCode);
			return new SuccessResult("Coupon code added successfully");
		}

		public IDataResult<List<UserCouponCode>> GetAllUserCouponCodes()
		{
			var codes = _userCouponCodeDal.GetAllUserCouponCodes();
			if (codes == null || !codes.Any())
				return new ErrorDataResult<List<UserCouponCode>>("No coupon codes found");

			return new SuccessDataResult<List<UserCouponCode>>(codes, "Coupon codes listed");
		}

		public IDataResult<UserCouponCodeDto> GetUserCouponCodeById(int id)
		{
			var code = _userCouponCodeDal.GetUserCouponCodeById(id);
			if (code == null)
				return new ErrorDataResult<UserCouponCodeDto>("Coupon code not found");
			return new SuccessDataResult<UserCouponCodeDto>(code, "Coupon code retrieved successfully");
		}

		public IDataResult<List<UserCouponCode>> GetUserCouponCodesByUserId(int userId)
		{
			var codes = _userCouponCodeDal.GetUserCouponCodesByUserId(userId);
			if (codes == null || !codes.Any())
				return new ErrorDataResult<List<UserCouponCode>>("No coupon codes found for user");

			return new SuccessDataResult<List<UserCouponCode>>(codes, "User's coupon codes listed");
		}
		public IResult MarkkUsedCouponCode(int id)
		{
			var userCouponCodeDto = _userCouponCodeDal.GetUserCouponCodeById(id);
			if (userCouponCodeDto == null)
				return new ErrorResult("Coupon code not found");
			if (userCouponCodeDto.IsUsed)
				return new ErrorResult("Coupon code is already used");

			_userCouponCodeDal.UpdateUserCouponCode(id);
			return new SuccessResult("Coupon code marked as used successfully");
		}
		public IDataResult<UserCouponCode> GetUserCouponCodeByCode(Guid couponCode)
		{
			var userCouponCode = _userCouponCodeDal.GetUserCouponCodeByCode(couponCode);
			if (userCouponCode == null)
				return new ErrorDataResult<UserCouponCode>("Coupon code not found");
			return new SuccessDataResult<UserCouponCode>(userCouponCode, "Coupon code retrieved successfully");
		}
	}
}