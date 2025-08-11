using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface IUserTaskDal
	{
		void AddUserTask(UserTask userTask);
		void DeleteUserTask(int id);
		List<UserTask> GetAllUserTasks();
		UserTask GetUserTaskById(int id);
		List<UserTask> GetUserTasksByUserId(int userId);
		bool IsTaskCompletedByUser(int taskId, int userId);
		List<UserTask> GetCompletedTasksByUser(int userId);
		List<UserTaskStatusDto> GetUserTaskStatusByUserId(int userId);
	}
}
