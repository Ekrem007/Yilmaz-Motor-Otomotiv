using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Dtos;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface ITaskService
	{
		IResult AddTask(YılmazMotorWeb.Entities.Concretes.Task task);
		IResult UpdateTask(YılmazMotorWeb.Entities.Concretes.Task task, int taskId);
		IResult DeleteTask(int id);
		IDataResult<List<TaskWithCouponDto>> GetAllTasks();
		IDataResult<TaskWithCouponDto> GetTaskById(int id);
		IDataResult<bool> IsTaskCompletedByUser(int taskId, int userId);
		IDataResult<List<TaskStatusDto>> GetTaskStatusesForUser(int userId);
	}
}
