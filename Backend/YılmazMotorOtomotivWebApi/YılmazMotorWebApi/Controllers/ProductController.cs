using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWebApi.Controllers
{
	public class ProductController : Controller
	{
		private readonly IProductService _productService;
		public ProductController(IProductService productService)
		{
			_productService = productService;
		}
		public IActionResult Index()
		{
			return View();
		}
		[HttpGet]
		[Route("api/[controller]/getall")]
		public IActionResult GetAll()
		{
			var result = _productService.GetAll();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
		[HttpPost]
		[Route("api/[controller]/add")]
		public IActionResult Add([FromBody] Product product)
		{
			var result = _productService.Add(product);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
		[HttpDelete]
		[Route("api/[controller]/delete/{productId}")]
		public IActionResult Delete(int productId)
		{
			var result = _productService.Delete(productId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}
		[HttpPut]
		[Route("api/[controller]/update/{productId}")]
		public IActionResult Update([FromBody] Product product, int productId)
		{
			var result = _productService.Update(product, productId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}
	}
}
