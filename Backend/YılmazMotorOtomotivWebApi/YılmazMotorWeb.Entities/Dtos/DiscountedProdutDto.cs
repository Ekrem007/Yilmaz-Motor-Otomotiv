using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Entities.Dtos
{
	public class DiscountedProdutDto
	{
		public int ProductId { get; set; }
		public string ProductName { get; set; }
		public string CategoryName { get; set; }
		public int ProductStock { get; set; }
		public string ProductDescription { get; set; }
		public decimal OriginalPrice { get; set; }
		public decimal DiscountRate { get; set; }
		public decimal DiscountedPrice { get; set; }
		public string ImageUrl { get; set; }
		public int Stock { get; set; }
		public DateTime DiscountStartDate { get; set; }
		public DateTime DiscountEndDate { get; set; }
	}
}
