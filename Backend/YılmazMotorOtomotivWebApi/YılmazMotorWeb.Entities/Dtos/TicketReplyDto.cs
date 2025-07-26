using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Entities.Dtos
{
	public class TicketReplyDto
	{
		public int Id { get; set; }
		public int TicketId { get; set; }
		public string ReplyMessage { get; set; }
		public DateTime RepliedAt { get; set; }
		public int UserId { get; set; }
		public UserDto User { get; set; }
	}
}
