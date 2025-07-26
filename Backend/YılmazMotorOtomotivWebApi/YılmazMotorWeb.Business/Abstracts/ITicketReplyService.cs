using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface ITicketReplyService
	{
		IResult Add(TicketReply ticketReply);
		IResult Update(TicketReply ticketReply, int ticketReplyId);
		IResult Delete(int ticketReplyId);
		IDataResult<TicketReply> GetById(int ticketReplyId);
		IDataResult<List<TicketReply>> GetAll();
		IDataResult<List<TicketReply>> GetRepliesByTicketId(int ticketId);

	}
}
