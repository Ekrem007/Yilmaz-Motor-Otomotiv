using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface ITicketReplyDal
	{
		void Add(TicketReply ticketReply);
		void Update(TicketReply ticketReply, int ticketReplyId);
		void Delete(int ticketReplyId);
		TicketReplyDto GetById(int ticketReplyId);
		List<TicketReplyDto> GetAll();
		List<TicketReplyDto> GetRepliesByTicketId(int ticketId);
	}
}
