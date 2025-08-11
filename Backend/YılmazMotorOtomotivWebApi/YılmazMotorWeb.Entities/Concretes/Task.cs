using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Entities.Concretes
{
	public class Task
	{
		public int Id { get; set; }
		public string TaskName { get; set; }
		public string Description { get; set; }
		public int TargetAmount { get; set; }
		public int CouponId { get; set; } 
		public Coupon Coupon { get; set; }
		public List<UserTask> UserTasks { get; set; } = new List<UserTask>();
	}
}
