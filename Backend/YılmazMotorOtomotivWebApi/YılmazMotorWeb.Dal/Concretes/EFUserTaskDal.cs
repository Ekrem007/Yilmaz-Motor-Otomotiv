using Microsoft.EntityFrameworkCore;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Dal.Context;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Concretes
{
	public class EFUserTaskDal : IUserTaskDal
	{
		private readonly YılmazMotorWebDbContext _context;

		public EFUserTaskDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}

		public void AddUserTask(UserTask userTask)
		{
			_context.UserTasks.Add(userTask);
			_context.SaveChanges();
		}

		public void DeleteUserTask(int id)
		{
			var deleteUserTask = _context.UserTasks.Find(id);
			if (deleteUserTask != null)
			{
				_context.UserTasks.Remove(deleteUserTask);
				_context.SaveChanges();
			}
			else
			{
				throw new Exception("UserTask not found");
			}
		}

		public List<UserTask> GetAllUserTasks()
		{
			var userTasks = _context.UserTasks
				.Include(ut => ut.User)
				.Include(ut => ut.Task)
				.ToList();

			if (userTasks == null || !userTasks.Any())
			{
				throw new Exception("No user tasks found");
			}
			return userTasks;
		}

		public UserTask GetUserTaskById(int id)
		{
			var userTask = _context.UserTasks
				.Include(ut => ut.User)
				.Include(ut => ut.Task)
				.FirstOrDefault(ut => ut.Id == id);

			if (userTask == null)
			{
				throw new Exception("UserTask not found");
			}
			return userTask;
		}

		public List<UserTask> GetUserTasksByUserId(int userId)
		{
			var userTasks = _context.UserTasks
				.Include(ut => ut.Task)
				.ThenInclude(t => t.Coupon)
				.Where(ut => ut.UserId == userId)
				.ToList();

			return userTasks;
		}


		public bool IsTaskCompletedByUser(int taskId, int userId)
		{
			return _context.UserTasks.Any(ut => ut.TaskId == taskId && ut.UserId == userId);
		}

		public List<UserTask> GetCompletedTasksByUser(int userId)
		{
			return _context.UserTasks
				.Include(ut => ut.Task)
				.ThenInclude(t => t.Coupon)
				.Where(ut => ut.UserId == userId)
				.OrderByDescending(ut => ut.CompletedDate)
				.ToList();
		}
		public List<UserTaskStatusDto> GetUserTaskStatusByUserId(int userId)
		{
			var allTasks = _context.Tasks
				.Include(t => t.Coupon)
				.ToList();

			var completedTasks = _context.UserTasks
				.Where(ut => ut.UserId == userId)
				.ToList();

			// Kullanıcının sahip olduğu kupon kodlarını çekiyoruz
			var userCouponCodes = _context.UserCouponCodes
				.Where(ucc => ucc.UserId == userId)
				.ToList();

			var result = allTasks.Select(task =>
			{
				var completed = completedTasks.FirstOrDefault(ut => ut.TaskId == task.Id);
				// Eğer görev tamamlanmışsa, ilgili kupon kodunu bul
				string? couponCode = null;
				if (completed != null && task.CouponId != 0)
				{
					var userCoupon = userCouponCodes.FirstOrDefault(ucc => ucc.CouponId == task.CouponId);
					couponCode = userCoupon?.CouponCode.ToString();
				}

				return new UserTaskStatusDto
				{
					TaskId = task.Id,
					TaskName = task.TaskName,
					Description = task.Description,
					TargetAmount = task.TargetAmount,
					CouponName = task.Coupon?.CouponName,
					CouponDiscountAmount = task.Coupon?.DiscountAmount ?? 0,
					CouponCode = couponCode,
					IsCompleted = completed != null
				};
			}).ToList();

			return result;
		}


	}
}