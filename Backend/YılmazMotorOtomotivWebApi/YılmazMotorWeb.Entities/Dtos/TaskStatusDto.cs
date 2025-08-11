using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Entities.Dtos
{
	public class TaskStatusDto
	{
		public int Id { get; set; }
		public string TaskName { get; set; }
		public string Description { get; set; }
		public int TargetAmount { get; set; }
		public string CouponName { get; set; }
		public decimal CouponDiscountAmount { get; set; }
		public bool IsCompleted { get; set; }
	}
}
