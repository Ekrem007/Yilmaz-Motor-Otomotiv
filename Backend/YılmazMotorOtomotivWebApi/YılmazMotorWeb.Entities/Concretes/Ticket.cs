using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Identity;

namespace YılmazMotorWeb.Entities.Concretes
{
	public class Ticket
	{
		public int Id { get; set; }
		public string Subject { get; set; }
		public string Message { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.Now;
		public int UserId { get; set; }
		public TicketStatus Status { get; set; } = TicketStatus.Open;
		public AppUser User { get; set; }
		public ICollection<TicketReply> Replies { get; set; }
	}
}
