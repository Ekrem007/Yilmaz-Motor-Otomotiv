using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Entities.Concretes
{
	public class Coupon
	{
		public int Id { get; set; }
		public string CouponName { get; set; }
		public decimal DiscountAmount { get; set; }

	}
}
