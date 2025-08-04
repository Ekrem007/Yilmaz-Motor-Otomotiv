using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWebApi.Controllers
{
	public class DiscountController : Controller
	{
		private readonly IDiscountService _discountService;

		public DiscountController(IDiscountService discountService)
		{
			_discountService = discountService;
		}
		[HttpGet]
		[Route("api/[controller]/getAll")]
		public IActionResult GetAll()
		{
			var result = _discountService.GetAllDiscounts();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
		[HttpPost]
		[Route("api/[controller]/add")]
		public IActionResult Add([FromBody] Discount discount)
		{
			var result = _discountService.AddDiscount(discount);
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
			var result = _discountService.GetDiscountById(id);
			if (result.Success)
			{
				return Ok(new
				{
					success = result.Success,
					message = result.Message,
					data = result.Data
				});
			}
			return NotFound(new
			{
				success = result.Success,
				message = result.Message
			});
		}



	}

}
