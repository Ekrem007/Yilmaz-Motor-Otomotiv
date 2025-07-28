using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Entities.Dtos
{
	public class OrderDetailsDto
	{
		public int OrderId { get; set; }
		public int UserId { get; set; }
		public string UserName { get; set; }
		public string ProductName { get; set; }
		public decimal ProductPrice { get; set; }
		public int Quantity { get; set; }
		public decimal TotalAmount { get; set; }
		public string Address { get; set; }	
		public string Status { get; set; }
		public DateTime OrderDate { get; set; } 


	}
}
