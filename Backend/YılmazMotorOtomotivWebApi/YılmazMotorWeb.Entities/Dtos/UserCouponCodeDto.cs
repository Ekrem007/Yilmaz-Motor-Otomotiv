using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Entities.Dtos
{
	public class UserCouponCodeDto
	{
		public int Id { get; set; }
		public int UserId { get; set; }
		public Guid CouponCode { get; set; }
		public int? CouponId { get; set; }
		public bool IsUsed { get; set; }
		public decimal DiscountAmount { get; set; }
		public DateTime? UsedDate { get; set; }

	}
}
