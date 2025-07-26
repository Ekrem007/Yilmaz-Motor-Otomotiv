using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Dal.Context;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Concretes
{
	public class EFTicketReplyDal : ITicketReplyDal
	{
		private readonly YılmazMotorWebDbContext _context;
		public EFTicketReplyDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}

		public void Add(TicketReply ticketReply)
		{
			if (ticketReply == null)
			{
				throw new ArgumentNullException(nameof(ticketReply), "TicketReply cannot be null");
			}
			_context.TicketReplies.Add(ticketReply);
			_context.SaveChanges();
		}

		public void Delete(int ticketReplyId)
		{
			var ticketReply = _context.TicketReplies.Find(ticketReplyId);
			if (ticketReply == null)
			{
				throw new KeyNotFoundException($"TicketReply with ID {ticketReplyId} not found.");
			}
			_context.TicketReplies.Remove(ticketReply);
			_context.SaveChanges();
		}

		public List<TicketReplyDto> GetAll()
		{
			return _context.TicketReplies
				.Include(tr => tr.User)
				.Select(tr => new TicketReplyDto
				{
					Id = tr.Id,
					TicketId = tr.TicketId,
					ReplyMessage = tr.ReplyMessage,
					RepliedAt = tr.RepliedAt,
					UserId = tr.UserId,
					User = new UserDto
					{
						Id = tr.User.Id,
						UserName = tr.User.UserName
					}
				}).ToList();
		}

		public TicketReplyDto GetById(int ticketReplyId)
		{
			var ticketReply = _context.TicketReplies
				.Include(tr => tr.User)
				.FirstOrDefault(tr => tr.Id == ticketReplyId);
			return new TicketReplyDto
			{
				Id = ticketReply.Id,
				TicketId = ticketReply.TicketId,
				ReplyMessage = ticketReply.ReplyMessage,
				RepliedAt = ticketReply.RepliedAt,
				UserId = ticketReply.UserId,
				User = new UserDto
				{
					Id = ticketReply.User.Id,
					UserName = ticketReply.User.UserName
				}
			};
		}

		public List<TicketReplyDto> GetRepliesByTicketId(int ticketId)
		{
			return _context.TicketReplies
				.Include(tr => tr.User)
				.Where(tr => tr.TicketId == ticketId)
				.Select(tr => new TicketReplyDto
				{
					Id = tr.Id,
					TicketId = tr.TicketId,
					ReplyMessage = tr.ReplyMessage,
					RepliedAt = tr.RepliedAt,
					UserId = tr.UserId,
					User = new UserDto
					{
						Id = tr.User.Id,
						UserName = tr.User.UserName
					}
				}).ToList();
		}

		public void Update(TicketReply ticketReply, int ticketReplyId)
		{
			if (ticketReply == null)
			{
				throw new ArgumentNullException(nameof(ticketReply), "TicketReply cannot be null");
			}
			var existingTicketReply = _context.TicketReplies.Find(ticketReplyId);
			existingTicketReply.ReplyMessage = ticketReply.ReplyMessage;
			existingTicketReply.RepliedAt = ticketReply.RepliedAt;
			existingTicketReply.UserId = ticketReply.UserId;
			_context.SaveChanges();
		}
	}
}
