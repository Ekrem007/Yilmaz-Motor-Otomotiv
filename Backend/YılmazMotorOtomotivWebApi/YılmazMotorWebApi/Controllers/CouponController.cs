using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWebApi.Controllers
{
	public class CouponController : Controller
	{
		private readonly ICouponService _couponService;

		public CouponController(ICouponService couponService)
		{
			_couponService = couponService;
		}



		[HttpGet]
		[Route("api/[controller]/getAll")]
		public IActionResult GetAll()
		{
			var result = _couponService.GetAllCoupons();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

		[HttpPost]
		[Route("api/[controller]/add")]
		public IActionResult Add([FromBody] Coupon coupon)
		{
			var result = _couponService.AddCoupon(coupon);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

		[HttpDelete]
		[Route("api/[controller]/delete/{couponId}")]
		public IActionResult Delete(int couponId)
		{
			var result = _couponService.DeleteCoupon(couponId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}

		[HttpPut]
		[Route("api/[controller]/update/{couponId}")]
		public IActionResult Update([FromBody] Coupon coupon, int couponId)
		{
			var result = _couponService.UpdateCoupon(coupon, couponId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}

		[HttpGet]
		[Route("api/[controller]/getById/{id}")]
		public IActionResult GetById(int id)
		{
			var result = _couponService.GetCouponById(id);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

		[HttpGet]
		[Route("api/[controller]/getCouponsByName/{name}")]
		public IActionResult GetCouponsByName(string name)
		{
			var result = _couponService.GetCouponsByName(name);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
	}
}