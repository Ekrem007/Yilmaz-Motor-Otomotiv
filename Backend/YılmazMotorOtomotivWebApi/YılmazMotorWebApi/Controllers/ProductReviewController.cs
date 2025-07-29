using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWebApi.Controllers
{
	public class ProductReviewController : Controller
	{
		private readonly IProductReviewService _productReviewService;
		public ProductReviewController(IProductReviewService productReviewService)
		{
			_productReviewService = productReviewService;
		}
		public IActionResult Index()
		{
			return View();
		}
		[HttpGet]
		[Route("api/[controller]/getall")]
		public IActionResult GetAll()
		{
			var result = _productReviewService.GetAll();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
		[HttpPost]
		[Route("api/[controller]/add")]
		public IActionResult Add([FromBody] ProductReview productReview)
		{
			var result = _productReviewService.Add(productReview);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
		[HttpDelete]
		[Route("api/[controller]/delete/{productReviewId}")]
		public IActionResult Delete(int productReviewId)
		{
			var result = _productReviewService.Delete(productReviewId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}
		[HttpPut]
		[Route("api/[controller]/update/{productReviewId}")]
		public IActionResult Update([FromBody] ProductReview productReview, int productReviewId)
		{
			var result = _productReviewService.Update(productReview, productReviewId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}
		[HttpGet]
		[Route("api/[controller]/getTopRatedProduct")]
		public IActionResult GetTopRatedProduct()
		{
			var result = _productReviewService.GetTopRatedProduct();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

	}
}
