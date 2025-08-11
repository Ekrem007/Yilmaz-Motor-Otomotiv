using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Dal.Context;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Dal.Concretes
{
	public class EFTaskDal : ITaskDal
	{
		private readonly YılmazMotorWebDbContext _context;

		public EFTaskDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}

		public void AddTask(YılmazMotorWeb.Entities.Concretes.Task task)
		{
			_context.Tasks.Add(task);
			_context.SaveChanges();
		}

		public void DeleteTask(int id)
		{
			var deleteTask = _context.Tasks.Find(id);
			if (deleteTask != null)
			{
				_context.Tasks.Remove(deleteTask);
				_context.SaveChanges();
			}
			else
			{
				throw new Exception("Task not found");
			}
		}

		public List<TaskWithCouponDto> GetAllTasks()
		{
			var tasks = _context.Tasks
				.Include(t => t.Coupon)
				.Select(t => new TaskWithCouponDto
				{
					Id = t.Id,
					TaskName = t.TaskName,
					Description = t.Description,
					TargetAmount = t.TargetAmount,
					CouponId = t.Coupon != null ? (int?)t.Coupon.Id : null,
					CouponName = t.Coupon != null ? t.Coupon.CouponName : null,
					CouponDiscountAmount = t.Coupon != null ? t.Coupon.DiscountAmount : 0
				}).ToList();

			if (tasks == null || !tasks.Any())
			{
				throw new Exception("No tasks found");
			}
			return tasks;
		}

		public TaskWithCouponDto GetTaskById(int id)
		{
			var task = _context.Tasks
				.Include(t => t.Coupon)
				.Where(t => t.Id == id)
				.Select(t => new TaskWithCouponDto
				{
					Id = t.Id,
					TaskName = t.TaskName,
					Description = t.Description,
					TargetAmount = t.TargetAmount,
					CouponName = t.Coupon != null ? t.Coupon.CouponName : null,
					CouponDiscountAmount = t.Coupon != null ? t.Coupon.DiscountAmount : 0
				}).FirstOrDefault();

			if (task == null)
			{
				throw new Exception("Task not found");
			}
			return task;
		}

		public void UpdateTask(Entities.Concretes.Task task, int taskId)
		{
			var existingTask = _context.Tasks.Find(taskId);
			if (existingTask != null)
			{
				existingTask.TaskName = task.TaskName;
				existingTask.Description = task.Description;
				existingTask.TargetAmount = task.TargetAmount;
				existingTask.CouponId = task.CouponId;
				_context.SaveChanges();
			}
			else
			{
				throw new Exception("Task not found");
			}
		}

		public List<TaskWithCouponDto> GetTasksByName(string name)
		{
			var tasks = _context.Tasks
				.Include(t => t.Coupon)
				.Where(t => t.TaskName.ToLower().Contains(name.ToLower()))
				.Select(t => new TaskWithCouponDto
				{
					Id = t.Id,
					TaskName = t.TaskName,
					Description = t.Description,
					TargetAmount = t.TargetAmount,
					CouponName = t.Coupon != null ? t.Coupon.CouponName : null,
					CouponDiscountAmount = t.Coupon != null ? t.Coupon.DiscountAmount : 0
				}).ToList();
			return tasks;
		}

		public bool IsTaskCompletedByUser(int taskId, int userId)
		{
			return _context.UserTasks.Any(ut => ut.TaskId == taskId && ut.UserId == userId);
		}

		public List<TaskStatusDto> GetTaskStatusesForUser(int userId)
		{
			var allTasks = _context.Tasks
			.Include(t => t.Coupon)
			.ToList();

			var completedTaskIds = _context.UserTasks
			.Where(ut => ut.UserId == userId)
			.Select(ut => ut.TaskId)
			.ToList();

			var taskStatuses = allTasks.Select(task => new TaskStatusDto
			{
				Id = task.Id,
				TaskName = task.TaskName,
				Description = task.Description,
				TargetAmount = task.TargetAmount,
				CouponName = task.Coupon?.CouponName,
				CouponDiscountAmount = task.Coupon?.DiscountAmount ?? 0,
				IsCompleted = completedTaskIds.Contains(task.Id)
			}).ToList();

			return taskStatuses;
		}
	}
}