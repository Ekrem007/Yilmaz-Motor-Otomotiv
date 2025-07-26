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
	public class EFTicketDal : ITicketDal
	{
		private readonly YılmazMotorWebDbContext _context;

		public EFTicketDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}

		public void Add(Ticket ticket)
		{
			if (ticket == null)
			{
				throw new ArgumentNullException(nameof(ticket), "Ticket cannot be null");
			}
			_context.Tickets.Add(ticket);
			_context.SaveChanges();
		}

		public void Delete(int ticketId)
		{
			var ticket = _context.Tickets.Find(ticketId);
			if (ticket == null)
			{
				throw new KeyNotFoundException($"Ticket with ID {ticketId} not found.");
			}
			_context.Tickets.Remove(ticket);
			_context.SaveChanges();
		}

		public List<TicketDto> GetAll()
		{
			return _context.Tickets
				.Include(t => t.User)
				.Include(t => t.Replies)
					.ThenInclude(r => r.User)
				.Select(t => new TicketDto
				{
					Id = t.Id,
					Subject = t.Subject,
					Message = t.Message,
					CreatedAt = t.CreatedAt,
					UserId = t.UserId,
					Status = t.Status,
					User = t.User == null ? null : new UserDto
					{
						Id = t.User.Id,
						UserName = t.User.UserName
					},
					Replies = t.Replies
						.OrderBy(r => r.RepliedAt) 
						.Select(r => new TicketReplyDto
						{
							Id = r.Id,
							TicketId = r.TicketId,
							ReplyMessage = r.ReplyMessage,
							RepliedAt = r.RepliedAt,
							UserId = r.UserId,
							User = r.User == null ? null : new UserDto
							{
								Id = r.User.Id,
								UserName = r.User.UserName
							}
						}).ToList()
				})
				.ToList();
		}

		public TicketDto GetById(int ticketId)
		{
			var ticket = _context.Tickets
				.Include(t => t.User)
				.Include(t => t.Replies)
					.ThenInclude(r => r.User)
				.FirstOrDefault(t => t.Id == ticketId);

			if (ticket == null)
			{
				throw new KeyNotFoundException($"Ticket with ID {ticketId} not found.");
			}

			return new TicketDto
			{
				Id = ticket.Id,
				Subject = ticket.Subject,
				Message = ticket.Message,
				CreatedAt = ticket.CreatedAt,
				UserId = ticket.UserId,
				Status = ticket.Status,
				User = ticket.User == null ? null : new UserDto
				{
					Id = ticket.User.Id,
					UserName = ticket.User.UserName
				},
				Replies = ticket.Replies
					.OrderBy(r => r.RepliedAt) 
					.Select(r => new TicketReplyDto
					{
						Id = r.Id,
						TicketId = r.TicketId,
						ReplyMessage = r.ReplyMessage,
						RepliedAt = r.RepliedAt,
						UserId = r.UserId,
						User = r.User == null ? null : new UserDto
						{
							Id = r.User.Id,
							UserName = r.User.UserName
						}
					}).ToList()
			};
		}



		public List<TicketDto> GetTicketsByUserId(int userId)
		{
			return _context.Tickets
				.Include(t => t.User)
				.Include(t => t.Replies)
					.ThenInclude(r => r.User)
				.Where(t => t.UserId == userId)
				.Select(t => new TicketDto
				{
					Id = t.Id,
					Subject = t.Subject,
					Message = t.Message,
					CreatedAt = t.CreatedAt,
					UserId = t.UserId,
					Status = t.Status,
					User = t.User == null ? null : new UserDto
					{
						Id = t.User.Id,
						UserName = t.User.UserName
					},
					Replies = t.Replies.Select(r => new TicketReplyDto
					{
						Id = r.Id,
						TicketId = r.TicketId,
						ReplyMessage = r.ReplyMessage,
						RepliedAt = r.RepliedAt,
						UserId = r.UserId,
						User = r.User == null ? null : new UserDto
						{
							Id = r.User.Id,
							UserName = r.User.UserName
						}
					}).ToList()
				})
				.ToList();
		}

		public void Update(Ticket ticket, int ticketId)
		{
			if (ticket == null)
			{
				throw new ArgumentNullException(nameof(ticket), "Ticket cannot be null");
			}
			var existingTicket = _context.Tickets.Find(ticketId);
			if (existingTicket == null)
			{
				throw new KeyNotFoundException($"Ticket with ID {ticketId} not found.");
			}
			existingTicket.Subject = ticket.Subject;
			existingTicket.Message = ticket.Message;
			existingTicket.Status = ticket.Status;
			_context.Tickets.Update(existingTicket);
			_context.SaveChanges();
		}
	}
}
