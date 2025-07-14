using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Entities.Dtos
{
	public class ProductReviewDto
	{
		public int Id { get; set; }
		public int ProductId { get; set; }
		public int UserId { get; set; }
		public string ReviewText { get; set; }
		public int Rating { get; set; }
		public DateTime CreatedAt { get; set; }
		public string ProductName { get; set; }
		public string UserName { get; set; }
	}
}
