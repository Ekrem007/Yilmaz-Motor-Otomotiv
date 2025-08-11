using System.Collections.Generic;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface IUserTaskService
	{
		IResult AddUserTask(UserTask userTask);
		IResult DeleteUserTask(int id);
		IDataResult<List<UserTask>> GetAllUserTasks();
		IDataResult<UserTask> GetUserTaskById(int id);
		IDataResult<List<UserTask>> GetUserTasksByUserId(int userId);
		IDataResult<bool> IsTaskCompletedByUser(int taskId, int userId);
		IDataResult<List<UserTask>> GetCompletedTasksByUser(int userId);
		IDataResult<List<UserTaskStatusDto>> GetUserTaskStatusByUserId(int userId);
	}
}