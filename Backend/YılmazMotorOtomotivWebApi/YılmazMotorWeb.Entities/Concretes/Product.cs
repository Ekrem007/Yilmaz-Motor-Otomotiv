using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Entities.Concretes
{
	public class Product
	{
		public int Id { get; set; }
		public int CategoryId { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public decimal Price { get; set; }
		public string ImageUrl { get; set; }
		public int Stock { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.Now;

		public Category Category { get; set; }
		public ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
		public ICollection<Discount> Discounts { get; set; } = new List<Discount>();
	}
}
