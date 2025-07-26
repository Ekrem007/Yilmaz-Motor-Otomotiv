using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Identity;

namespace YılmazMotorWeb.Entities.Concretes
{
	public class TicketReply
	{
		public int Id { get; set; }
		public int TicketId { get; set; }
		public string ReplyMessage { get; set; }
		public DateTime RepliedAt { get; set; } = DateTime.Now; 
		public int UserId { get; set; } 
		public AppUser User { get; set; }
		public Ticket Ticket { get; set; }
	}
}
