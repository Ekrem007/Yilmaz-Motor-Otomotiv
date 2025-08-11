using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWebApi.Controllers
{
	public class UserTaskController : Controller
	{
		private readonly IUserTaskService _userTaskService;

		public UserTaskController(IUserTaskService userTaskService)
		{
			_userTaskService = userTaskService;
		}

		public IActionResult Index()
		{
			return View();
		}

		[HttpPost]
		[Route("api/[controller]/add")]
		public IActionResult Add([FromBody] UserTask userTask)
		{
			var result = _userTaskService.AddUserTask(userTask);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
			});
		}

		[HttpDelete]
		[Route("api/[controller]/delete/{id}")]
		public IActionResult Delete(int id)
		{
			var result = _userTaskService.DeleteUserTask(id);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}

		[HttpGet]
		[Route("api/[controller]/getall")]
		public IActionResult GetAll()
		{
			var result = _userTaskService.GetAllUserTasks();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

		[HttpGet]
		[Route("api/[controller]/getbyid/{id}")]
		public IActionResult GetById(int id)
		{
			var result = _userTaskService.GetUserTaskById(id);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

		[HttpGet]
		[Route("api/[controller]/getbyuserid/{userId}")]
		public IActionResult GetByUserId(int userId)
		{
			var result = _userTaskService.GetUserTasksByUserId(userId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

	

		[HttpGet]
		[Route("api/[controller]/istaskcompleted/{taskId}/{userId}")]
		public IActionResult IsTaskCompleted(int taskId, int userId)
		{
			var result = _userTaskService.IsTaskCompletedByUser(taskId, userId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

		[HttpGet]
		[Route("api/[controller]/getcompletedtasks/{userId}")]
		public IActionResult GetCompletedTasks(int userId)
		{
			var result = _userTaskService.GetCompletedTasksByUser(userId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

		[HttpGet]
		[Route("api/[controller]/getcompletedtaskscount/{userId}")]
		public IActionResult GetCompletedTasksCount(int userId)
		{
			var result = _userTaskService.GetCompletedTasksByUser(userId);
			if (result.Success)
			{
				var completedCount = result.Data.Count;
				return Ok(new
				{
					success = true,
					message = "Completed tasks count retrieved successfully",
					data = completedCount
				});
			}
			return BadRequest(new
			{
				success = false,
				message = result.Message
			});
		}
		[HttpGet]
		[Route("api/[controller]/getUserTaskStatus/{userId}")]
		public IActionResult GetUserTaskStatus(int userId)
		{
			var result = _userTaskService.GetUserTaskStatusByUserId(userId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
	}
}