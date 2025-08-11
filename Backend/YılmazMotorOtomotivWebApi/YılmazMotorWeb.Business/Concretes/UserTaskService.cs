using System.Collections.Generic;
using System.Linq;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Concretes
{
	public class UserTaskService : IUserTaskService
	{
		private readonly IUserTaskDal _userTaskDal;

		public UserTaskService(IUserTaskDal userTaskDal)
		{
			_userTaskDal = userTaskDal;
		}

		public IResult AddUserTask(UserTask userTask)
		{
			if (userTask == null)
				return new ErrorResult("UserTask cannot be null");

			_userTaskDal.AddUserTask(userTask);
			return new SuccessResult("UserTask added successfully");
		}

		public IResult DeleteUserTask(int id)
		{
			if (id <= 0)
				return new ErrorResult("Invalid UserTask ID");

			_userTaskDal.DeleteUserTask(id);
			return new SuccessResult("UserTask deleted successfully");
		}

		public IDataResult<List<UserTask>> GetAllUserTasks()
		{
			var tasks = _userTaskDal.GetAllUserTasks();
			if (tasks == null || !tasks.Any())
				return new ErrorDataResult<List<UserTask>>("No user tasks found");

			return new SuccessDataResult<List<UserTask>>(tasks, "User tasks listed");
		}

		public IDataResult<UserTask> GetUserTaskById(int id)
		{
			var task = _userTaskDal.GetUserTaskById(id);
			if (task == null)
				return new ErrorDataResult<UserTask>("UserTask not found");

			return new SuccessDataResult<UserTask>(task, "UserTask found");
		}

		public IDataResult<List<UserTask>> GetUserTasksByUserId(int userId)
		{
			var tasks = _userTaskDal.GetUserTasksByUserId(userId);
			if (tasks == null || !tasks.Any())
				return new ErrorDataResult<List<UserTask>>("No tasks found for user");

			return new SuccessDataResult<List<UserTask>>(tasks, "User's tasks listed");
		}


		public IDataResult<bool> IsTaskCompletedByUser(int taskId, int userId)
		{
			if (taskId <= 0 || userId <= 0)
				return new ErrorDataResult<bool>("Invalid task or user ID");

			bool completed = _userTaskDal.IsTaskCompletedByUser(taskId, userId);
			return new SuccessDataResult<bool>(completed, "Task completion status retrieved");
		}

		public IDataResult<List<UserTask>> GetCompletedTasksByUser(int userId)
		{
			var tasks = _userTaskDal.GetCompletedTasksByUser(userId);
			if (tasks == null || !tasks.Any())
				return new ErrorDataResult<List<UserTask>>("No completed tasks found for user");

			return new SuccessDataResult<List<UserTask>>(tasks, "Completed tasks for user listed");
		}
		public IDataResult<List<UserTaskStatusDto>> GetUserTaskStatusByUserId(int userId)
		{
			if (userId <= 0)
				return new ErrorDataResult<List<UserTaskStatusDto>>("Invalid user ID");
			var taskStatuses = _userTaskDal.GetUserTaskStatusByUserId(userId);
			if (taskStatuses == null || !taskStatuses.Any())
				return new ErrorDataResult<List<UserTaskStatusDto>>("No task statuses found for user");
			return new SuccessDataResult<List<UserTaskStatusDto>>(taskStatuses, "User task statuses retrieved");
		}
	}
}