using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWebApi.Controllers
{
	public class CategoryController : Controller
	{
		private readonly ICategoryService _categoryService;
		public CategoryController(ICategoryService categoryService)
		{
			_categoryService = categoryService;
		}
		[HttpGet]
		[Route("api/[controller]/getall")]
		public IActionResult GetAll()
		{
			var result = _categoryService.GetAll();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

		[HttpPost]
		[Route("api/[controller]/add")]
		public IActionResult Add([FromBody] Category category)
		{
			var result = _categoryService.Add(category);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
		[HttpPut]
		[Route("api/[controller]/update")]
		public IActionResult Update([FromBody] Category category)
		{
			var result = _categoryService.Update(category);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}
		[HttpDelete]
		[Route("api/[controller]/delete/{categoryId}")]
		public IActionResult Delete(int categoryId)
		{
			var result = _categoryService.Delete(categoryId);
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
			var result = _categoryService.GetById(id);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}







	}
}
