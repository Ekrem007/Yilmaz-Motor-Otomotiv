using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Identity;

namespace YılmazMotorWeb.Entities.Concretes
{
	public class ProductReview
	{
		public int Id { get; set; }
		public int ProductId { get; set; }
		public int UserId { get; set; }
		public string ReviewText { get; set; }
		public int Rating { get; set; } 
		public DateTime CreatedAt { get; set; } = DateTime.Now;
		public Product Product { get; set; }
		public AppUser User { get; set; }

	}
}
