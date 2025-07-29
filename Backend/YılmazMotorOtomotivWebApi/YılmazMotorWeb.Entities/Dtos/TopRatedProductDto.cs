using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Entities.Dtos
{
	public class TopRatedProductDto
	{
		public string ProductName { get; set; }
		public double AverageRating { get; set; }
		public int ReviewCount { get; set; }
	}
}
