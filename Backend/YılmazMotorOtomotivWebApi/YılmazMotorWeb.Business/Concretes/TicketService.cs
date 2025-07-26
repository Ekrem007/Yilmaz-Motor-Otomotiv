using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Concretes
{
	public class TicketService : ITicketService
	{
		private readonly ITicketDal _ticketDal;

		public TicketService(ITicketDal ticketDal)
		{
			_ticketDal = ticketDal;
		}

		public IResult AddTicket(Ticket ticket)
		{
			if (ticket == null)
			{
				return new ErrorResult("Ticket cannot be null");
			}
			_ticketDal.Add(ticket);
			return new SuccessResult("Ticket added successfully");
		}

		public IResult DeleteTicket(int ticketId)
		{
			_ticketDal.Delete(ticketId);
			return new SuccessResult("Ticket deleted successfully");
		}

		public IDataResult<List<TicketDto>> GetAllTickets()
		{
			var tickets = _ticketDal.GetAll();
			if (tickets == null || !tickets.Any())
			{
				return new ErrorDataResult<List<TicketDto>>("No tickets found");
			}
			return new SuccessDataResult<List<TicketDto>>(tickets, "Tickets retrieved successfully");
		}

		public IDataResult<TicketDto> GetTicketById(int ticketId)
		{
			var ticket = _ticketDal.GetById(ticketId);
			if (ticket == null)
			{
				return new ErrorDataResult<TicketDto>("Ticket not found");
			}
			return new SuccessDataResult<TicketDto>(ticket, "Ticket retrieved successfully");
		}

		public IDataResult<List<TicketDto>> GetTicketsByUserId(int userId)
		{
			var tickets = _ticketDal.GetTicketsByUserId(userId);
			if (tickets == null || !tickets.Any())
			{
				return new ErrorDataResult<List<TicketDto>>("No tickets found for this user");
			}
			return new SuccessDataResult<List<TicketDto>>(tickets, "Tickets retrieved successfully for user");
		}

		public IResult UpdateTicket(Ticket ticket, int ticketId)
		{
			if (ticket == null)
			{
				return new ErrorResult("Ticket cannot be null");
			}
			_ticketDal.Update(ticket, ticketId);
			return new SuccessResult("Ticket updated successfully");
		}
	}
}
