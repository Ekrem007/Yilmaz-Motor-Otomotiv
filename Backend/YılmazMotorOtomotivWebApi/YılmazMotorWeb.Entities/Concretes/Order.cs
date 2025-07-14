using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Identity;

namespace YılmazMotorWeb.Entities.Concretes
{
	public class Order
	{
		public int Id { get; set; }
		public int UserId { get; set; }
		public decimal TotalAmount { get; set; }
		public DateTime OrderDate { get; set; } = DateTime.Now;
		public OrderStatus Status { get; set; } = OrderStatus.Pending;
		public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
		public AppUser User { get; set; }


	}
}
