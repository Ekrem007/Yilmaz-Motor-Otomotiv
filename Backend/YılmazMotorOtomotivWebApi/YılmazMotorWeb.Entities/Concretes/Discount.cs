using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Entities.Concretes
{
	public class Discount
	{
		public int Id { get; set; }
		public int ProductId { get; set; }
		public decimal Rate { get; set; }
		public DateTime StartDate { get; set; } = DateTime.Now;
		public DateTime EndDate { get; set; }

		// Computed column: DB tarafından otomatik hesaplanıyor
		public bool IsActive { get; private set; }

		public Product Product { get; set; }
	}
}
