using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Dal.Context;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Dal.Concretes
{
	public class EFContactMessageDal : IContactMessageDal
	{
		private readonly YılmazMotorWebDbContext _context;
		public EFContactMessageDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}
		public void AddContactMessage(ContactMessage contactMessage)
		{
			_context.ContactMessages.Add(contactMessage);
			_context.SaveChanges();
		}

		public void DeleteContactMessage(int id)
		{
			var contactMessage = _context.ContactMessages.Find(id);
			if (contactMessage != null)
			{
				_context.ContactMessages.Remove(contactMessage);
				_context.SaveChanges();
			}
			else
			{
				throw new Exception("Contact message not found");
			}
		}

		public List<ContactMessage> GetAllContactMessages()
		{
			return _context.ContactMessages.ToList();
		}

		public ContactMessage GetContactMessageById(int id)
		{
			return _context.ContactMessages.FirstOrDefault(cm => cm.Id == id);
		}

		public void UpdateContactMessage(ContactMessage contactMessage, int contactMessageId)
		{
			var existingMessage = _context.ContactMessages.Find(contactMessageId);
			if (existingMessage != null)
			{
				existingMessage.Name = contactMessage.Name;
				existingMessage.Email = contactMessage.Email;
				existingMessage.Message = contactMessage.Message;
				_context.SaveChanges();
			}
			else
			{
				throw new Exception("Contact message not found");
			}

		}

	}
}
