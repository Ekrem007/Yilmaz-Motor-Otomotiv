using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWebApi.Controllers
{
	public class TaskController : Controller
	{
		private readonly ITaskService _taskService;

		public TaskController(ITaskService taskService)
		{
			_taskService = taskService;
		}

		[HttpGet]
		[Route("api/[controller]/getAll")]
		public IActionResult GetAll()
		{
			var result = _taskService.GetAllTasks();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

		[HttpPost]
		[Route("api/[controller]/add")]
		public IActionResult Add([FromBody] YılmazMotorWeb.Entities.Concretes.Task task)
		{
			var result = _taskService.AddTask(task);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
			});
		}

		[HttpDelete]
		[Route("api/[controller]/delete/{taskId}")]
		public IActionResult Delete(int taskId)
		{
			var result = _taskService.DeleteTask(taskId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}

		[HttpPut]
		[Route("api/[controller]/update/{taskId}")]
		public IActionResult Update([FromBody] YılmazMotorWeb.Entities.Concretes.Task task, int taskId)
		{
			var result = _taskService.UpdateTask(task, taskId);
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
			var result = _taskService.GetTaskById(id);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}

		

		

		[HttpGet]
		[Route("api/[controller]/getTaskStatusesForUser/{userId}")]
		public IActionResult GetTaskStatusesForUser(int userId)
		{
			var result = _taskService.GetTaskStatusesForUser(userId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
	}
}