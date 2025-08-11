using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWebApi.Controllers
{
	public class UserController : Controller
	{
		private readonly IUserService _userService;
		public UserController(IUserService userService)
		{
			_userService = userService;
		}

		[HttpGet]
		[Route("api/[controller]/getall")]
		public IActionResult GetAll()
		{
			var result = _userService.GetAllUsers();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}


	}
}