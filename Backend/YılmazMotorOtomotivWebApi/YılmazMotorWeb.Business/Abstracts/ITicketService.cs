using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface ITicketService
	{
		IResult AddTicket(Ticket ticket);
		IResult DeleteTicket(int ticketId);
		IDataResult<List<TicketDto>> GetAllTickets();
		IDataResult<TicketDto> GetTicketById(int ticketId);
		IDataResult<List<TicketDto>> GetTicketsByUserId(int userId);
		IResult UpdateTicket(Ticket ticket, int ticketId);

	}
}
