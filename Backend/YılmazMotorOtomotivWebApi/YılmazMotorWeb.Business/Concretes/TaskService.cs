using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Entities.Dtos;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Business.Concretes
{
	public class TaskService : ITaskService
	{
		private readonly ITaskDal _taskDal;
		public TaskService(ITaskDal taskDal)
		{
			_taskDal = taskDal;
		}

		public IResult AddTask(YılmazMotorWeb.Entities.Concretes.Task task)
		{
			if (task == null)
			{
				return new ErrorResult("Task cannot be null");
			}
			if (string.IsNullOrWhiteSpace(task.TaskName))
			{
				return new ErrorResult("Task name cannot be empty");
			}
			if (task.TargetAmount <= 0)
			{
				return new ErrorResult("Target amount must be greater than zero");
			}
			_taskDal.AddTask(task);
			return new SuccessResult("Task added successfully");
		}

		public IResult DeleteTask(int id)
		{
			if (id <= 0)
			{
				return new ErrorResult("Invalid task ID");
			}
			_taskDal.DeleteTask(id);
			return new SuccessResult("Task deleted successfully");
		}

		public IDataResult<List<TaskWithCouponDto>> GetAllTasks()
		{
			var tasks = _taskDal.GetAllTasks();
			if (tasks == null || !tasks.Any())
			{
				return new ErrorDataResult<List<TaskWithCouponDto>>("No tasks found");
			}
			return new SuccessDataResult<List<TaskWithCouponDto>>(tasks, "Tasks retrieved successfully");
		}

		public IDataResult<TaskWithCouponDto> GetTaskById(int id)
		{
			if (id <= 0)
			{
				return new ErrorDataResult<TaskWithCouponDto>("Invalid task ID");
			}
			var task = _taskDal.GetTaskById(id);
			if (task == null)
			{
				return new ErrorDataResult<TaskWithCouponDto>("Task not found");
			}
			return new SuccessDataResult<TaskWithCouponDto>(task, "Task retrieved successfully");
		}



		public IDataResult<List<TaskStatusDto>> GetTaskStatusesForUser(int userId)
		{

			var statuses = _taskDal.GetTaskStatusesForUser(userId);
			if (statuses == null || !statuses.Any())
			{
				return new ErrorDataResult<List<TaskStatusDto>>("No task statuses found for the user");
			}
			return new SuccessDataResult<List<TaskStatusDto>>(statuses, "Task statuses retrieved successfully");
		}

		public IDataResult<bool> IsTaskCompletedByUser(int taskId, int userId)
		{
			if (taskId <= 0 || userId <= 0)
			{
				return new ErrorDataResult<bool>("Invalid task ID or user ID");
			}
			bool isCompleted = _taskDal.IsTaskCompletedByUser(taskId, userId);
			return new SuccessDataResult<bool>(isCompleted, "Task completion status retrieved successfully");
		}

		public IResult UpdateTask(YılmazMotorWeb.Entities.Concretes.Task task, int taskId)
		{
			if (task == null || taskId <= 0)
			{
				return new ErrorResult("Invalid task or task ID");
			}
			_taskDal.UpdateTask(task, taskId);
			return new SuccessResult("Task updated successfully");
		}
	}
}
