using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface ITicketDal
	{
		void Add(Ticket ticket);
		void Update(Ticket ticket, int ticketId);
		void Delete(int ticketId);
		TicketDto GetById(int ticketId);
		List<TicketDto> GetAll();
		List<TicketDto> GetTicketsByUserId(int userId);
		void ChangeStatus(int ticketId, TicketStatus status);
	}
}
