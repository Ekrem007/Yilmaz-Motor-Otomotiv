using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Entities.Dtos
{
	public class OrderDto
	{
		public int Id { get; set; }
		public int UserId { get; set; }
		public decimal TotalAmount { get; set; }
		public DateTime OrderDate { get; set; }
		public string Status { get; set; }
		public List<OrderItemDto> OrderItems { get; set; }
	}
}
