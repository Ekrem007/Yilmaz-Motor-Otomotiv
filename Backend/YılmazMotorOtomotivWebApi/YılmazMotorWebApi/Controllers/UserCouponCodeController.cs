using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWebApi.Controllers
{
	public class UserCouponCodeController : Controller
	{
		private readonly IUserCouponCodeService _userCouponCodeService;

		public UserCouponCodeController(IUserCouponCodeService userCouponCodeService)
		{
			_userCouponCodeService = userCouponCodeService;
		}

		[HttpPost]
		[Route("api/[controller]/add")]
		public IActionResult Add([FromBody] UserCouponCode userCouponCode)
		{
			var result = _userCouponCodeService.AddUserCouponCode(userCouponCode);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
			});
		}

		[HttpGet]
		[Route("api/[controller]/getall")]
		public IActionResult GetAll()
		{
			var result = _userCouponCodeService.GetAllUserCouponCodes();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

		[HttpGet]
		[Route("api/[controller]/getById/{id}")]
		public IActionResult GetById(int id)
		{
			var result = _userCouponCodeService.GetUserCouponCodeById(id);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

		[HttpGet]
		[Route("api/[controller]/getByUserId/{userId}")]
		public IActionResult GetByUserId(int userId)
		{
			var result = _userCouponCodeService.GetUserCouponCodesByUserId(userId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
		[HttpPut]
		[Route("api/[controller]/markUsed/{id}")]
		public IActionResult MarkUsed([FromBody] UserCouponCode userCouponCode, int id)
		{
			var result = _userCouponCodeService.MarkkUsedCouponCode(id);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
			});
		}
		[HttpGet]
		[Route("api/[controller]/getByCode/{couponCode}")]
		public IActionResult GetByCode(Guid couponCode)
		{
			var result = _userCouponCodeService.GetUserCouponCodeByCode(couponCode);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
	}
}