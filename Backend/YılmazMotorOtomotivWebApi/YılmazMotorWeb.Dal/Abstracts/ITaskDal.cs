using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface ITaskDal
	{
		void AddTask( YılmazMotorWeb.Entities.Concretes.Task task);
		void UpdateTask(YılmazMotorWeb.Entities.Concretes.Task task, int taskId);
		void DeleteTask(int id);
		List<TaskWithCouponDto> GetAllTasks();
		TaskWithCouponDto GetTaskById(int id);
		List<TaskWithCouponDto> GetTasksByName(string name);
		bool IsTaskCompletedByUser(int taskId, int userId);
		List<TaskStatusDto> GetTaskStatusesForUser(int userId);
	}
}
