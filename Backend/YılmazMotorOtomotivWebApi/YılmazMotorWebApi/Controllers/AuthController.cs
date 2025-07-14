using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Entities.Dtos;
using YılmazMotorWeb.Entities.Identity;

namespace YılmazMotorWebApi.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	//admin admin123
	//user user123

	public class AuthController : Controller
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly SignInManager<AppUser> _signInManager;

		public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
		{
			_userManager = userManager;
			_signInManager = signInManager;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterDto dto)
		{
			var user = new AppUser
			{
				UserName = dto.UserName,
				Email = dto.Email,
				Name = dto.Name,
				SurName = dto.SurName
			};

			var result = await _userManager.CreateAsync(user, dto.Password);

			if (result.Succeeded)
				return Ok("User registered successfully");

			return BadRequest(result.Errors);
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginDto dto)
		{
			var result = await _signInManager.PasswordSignInAsync(dto.UserName, dto.Password, false, false);

			if (result.Succeeded)
				return Ok("Login successful");

			return Unauthorized("Invalid login attempt");
		}
	}
}

