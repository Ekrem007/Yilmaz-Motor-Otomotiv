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
		private readonly RoleManager<AppRole> _roleManager;

		public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, RoleManager<AppRole> roleManager)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_roleManager = roleManager;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterDto dto)
		{
			var user = new AppUser
			{
				UserName = dto.UserName,
				Email = dto.Email,
				Name = dto.Name,
				SurName = dto.SurName,
				PhoneNumber = dto.PhoneNumber,
				Address = dto.Address
			};

			var result = await _userManager.CreateAsync(user, dto.Password);

			if (result.Succeeded)
			{
				var role = _roleManager.Roles.FirstOrDefault(r => r.Id == 2);
				if (role != null)
				{
					await _userManager.AddToRoleAsync(user, role.Name);
				}
				else
				{
					return BadRequest("Role with ID 2 not found.");
				}
				return Ok("User registered successfully");
			}

			return BadRequest(result.Errors);
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginDto dto)
		{
			var user = await _userManager.FindByNameAsync(dto.UserName);
			if (user == null)
				return Unauthorized("Invalid login attempt");

			var result = await _signInManager.PasswordSignInAsync(dto.UserName, dto.Password, false, false);

			if (!result.Succeeded)
				return Unauthorized("Invalid login attempt");

			var roles = await _userManager.GetRolesAsync(user);

			var roleId = 0;
			if (roles.Any())
			{
				var roleName = roles.First();
				var appRole = await _roleManager.FindByNameAsync(roleName);
				if (appRole != null)
					roleId = appRole.Id;
			}

			return Ok(new
			{
				message = "Login successful",
				userId = user.Id,
				roleId = roleId
			});
		}
		[HttpGet("getall")]
		public async Task<IActionResult> GetAll()
		{
			var users = _userManager.Users.ToList();

			var userList = new List<object>();

			foreach (var user in users)
			{
				var roles = await _userManager.GetRolesAsync(user);
				var role = roles.FirstOrDefault();

				userList.Add(new
				{
					user.Id,
					user.UserName,
					user.Email,
					user.Name,
					user.SurName,
					Role = role
				});
			}

			return Ok(userList);
		}
		[HttpGet("getUserById/{id}")]
		public async Task<IActionResult> GetUserById(int id)
		{
			var user = await _userManager.FindByIdAsync(id.ToString());
			if (user == null)
				return NotFound("User not found");
			var roles = await _userManager.GetRolesAsync(user);
			var role = roles.FirstOrDefault();
			return Ok(new
			{
				user.Id,
				user.UserName,
				user.Email,
				user.Name,
				user.SurName,
				user.Address,
				user.PhoneNumber
			});
		}
		[HttpPut("update/{id}")]
		public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
		{
			var user = await _userManager.FindByIdAsync(id.ToString());
			if (user == null)
				return NotFound(new { message = "User not found" });

			user.Email = dto.Email;
			user.Name = dto.Name;
			user.SurName = dto.SurName;
			user.PhoneNumber = dto.PhoneNumber;
			user.Address = dto.Address;

			var result = await _userManager.UpdateAsync(user);

			if (result.Succeeded)
				return Ok(new { message = "User updated successfully" });

			return BadRequest(new { message = "Update failed", errors = result.Errors });
		}
		[HttpGet("getTotalUsers")]
		public IActionResult GetTotalUsers()
		{
			int count = _userManager.Users.Count(u => u.Id != 1);
			return Ok(count);
		}



	}
}

