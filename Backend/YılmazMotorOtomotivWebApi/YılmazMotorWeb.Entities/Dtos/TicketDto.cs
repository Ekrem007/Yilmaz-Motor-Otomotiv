using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Entities.Dtos
{
	public class TicketDto
	{
		public int Id { get; set; }
		public string Subject { get; set; }
		public string Message { get; set; }
		public DateTime CreatedAt { get; set; }
		public int UserId { get; set; }
		public TicketStatus Status { get; set; }
		public UserDto User { get; set; }
		public List<TicketReplyDto> Replies { get; set; }
	}
}
