using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Identity;

namespace YılmazMotorWeb.Entities.Concretes
{
	public class UserTask
	{
		public int Id { get; set; }
		public int UserId { get; set; }
		public int TaskId { get; set; }
		public DateTime CompletedDate { get; set; } = DateTime.Now;
		public AppUser User { get; set; }
		public Task Task { get; set; }
	}
}
