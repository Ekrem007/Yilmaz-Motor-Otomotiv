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
	public class TicketReplyService : ITicketReplyService
	{
		private readonly ITicketReplyDal _ticketReplyDal;
		public TicketReplyService(ITicketReplyDal ticketReplyDal)
		{
			_ticketReplyDal = ticketReplyDal;
		}
		public IResult Add(TicketReply ticketReply)
		{
			if (ticketReply == null)
			{
				return new ErrorResult("Ticket reply cannot be null");
			}
			_ticketReplyDal.Add(ticketReply);
			return new SuccessResult("Ticket reply added successfully");
		}

		public IResult Delete(int ticketReplyId)
		{
			if (ticketReplyId <= 0)
			{
				return new ErrorResult("Invalid ticket reply ID");
			}
			_ticketReplyDal.Delete(ticketReplyId);
			return new SuccessResult("Ticket reply deleted successfully");
		}

		public IDataResult<List<TicketReplyDto>> GetAll()
		{
			var replies = _ticketReplyDal.GetAll();
			if (replies == null || !replies.Any())
			{
				return new ErrorDataResult<List<TicketReplyDto>>("No ticket replies found");
			}
			return new SuccessDataResult<List<TicketReplyDto>>(replies, "Ticket replies retrieved successfully");
		}

		public IDataResult<TicketReplyDto> GetById(int ticketReplyId)
		{
			if (ticketReplyId <= 0)
			{
				return new ErrorDataResult<TicketReplyDto>("Invalid ticket reply ID");
			}
			var reply = _ticketReplyDal.GetById(ticketReplyId);
			if (reply == null)
			{
				return new ErrorDataResult<TicketReplyDto>("Ticket reply not found");
			}
			return new SuccessDataResult<TicketReplyDto>(reply, "Ticket reply retrieved successfully");
		}

		public IDataResult<List<TicketReply>> GetRepliesByTicketId(int ticketId)
		{
			throw new NotImplementedException();
		}

		public IResult Update(TicketReply ticketReply, int ticketReplyId)
		{
			throw new NotImplementedException();
		}

		IDataResult<List<TicketReply>> ITicketReplyService.GetAll()
		{
			throw new NotImplementedException();
		}

		IDataResult<TicketReply> ITicketReplyService.GetById(int ticketReplyId)
		{
			throw new NotImplementedException();
		}
	}
}
