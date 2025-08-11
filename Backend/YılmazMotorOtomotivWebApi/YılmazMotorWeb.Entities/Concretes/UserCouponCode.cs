using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Identity;

namespace YılmazMotorWeb.Entities.Concretes
{
	public class UserCouponCode
	{
		public int Id { get; set; }
		public int UserId { get; set; }
		public Guid CouponCode { get; set; } = Guid.NewGuid();
		public int? CouponId { get; set; }
		public DateTime? UsedDate { get; set; }
		public bool IsUsed { get; set; } = false;
		public  AppUser User { get; set; }
		public Coupon Coupon { get; set; }
	}
}
