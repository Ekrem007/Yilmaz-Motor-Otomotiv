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
		[HttpGet]
		[Route("api/[controller]/getbyid/{id}")]
		public IActionResult GetById(int id)
		{
			var result = _productService.GetById(id);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
		[HttpGet]
		[Route("api/[controller]/getproductsbycategoryid/{categoryId}")]
		public IActionResult GetByCategoryId(int categoryId)
		{
			var result = _productService.GetProductsByCategoryId(categoryId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
		[HttpGet]
		[Route("api/[controller]/getProductsByName/{name}")]
		public IActionResult GetProductsByName(string name)
		{
			var result = _productService.GetProductsByName(name);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
		[HttpGet]
		[Route("api/[controller]/getTtoalProducStocks")]
		public IActionResult GetTotalProductStocks()
		{
			var result = _productService.GetAll();
			if (result.Success)
			{
				var totalStock = result.Data.Sum(p => p.Stock);
				return Ok(new
				{
					success = true,
					message = "Total product stocks retrieved successfully",
					data = totalStock
				});
			}
			return BadRequest(new
			{
				success = false,
				message = result.Message
			});

		}
		[HttpGet]
		[Route("api/[controller]/getTotalProductCount")]
		public IActionResult GetTotalProductCount()
		{
			var result = _productService.GetAll();
			if (result.Success)
			{
				var totalCount = result.Data.Count;
				return Ok(new
				{
					success = true,
					message = "Total product count retrieved successfully",
					data = totalCount
				});
			}
			return BadRequest(new
			{
				success = false,
				message = result.Message
			});
		}
		[HttpPost]
		[Route("api/[controller]/addStockToProduct/{productId}/{quantity}")]
		public IActionResult AddStockToProduct(int productId, int quantity)
		{
			var result = _productService.AddStockToProduct(productId, quantity);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}
	}
}
