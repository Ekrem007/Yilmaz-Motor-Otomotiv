using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Business.Concretes
{
	public class ContactMessageService : IContactMessageService
	{
		private readonly IContactMessageDal _contactMessageDal;
		public ContactMessageService(IContactMessageDal contactMessageDal)
		{
			_contactMessageDal = contactMessageDal;
		}
		public IResult Add(ContactMessage contactMessage)
		{
			if (contactMessage == null)
			{
				return new ErrorResult("Contact message cannot be null");
			}
			_contactMessageDal.AddContactMessage(contactMessage);
			return new SuccessResult("Contact message added successfully");
		}

		public IResult Delete(int contactMessageId)
		{
			_contactMessageDal.DeleteContactMessage(contactMessageId);
			return new SuccessResult("Contact message deleted successfully");
		}

		public IDataResult<List<ContactMessage>> GetAll()
		{
			var contactMessages = _contactMessageDal.GetAllContactMessages();
			return new SuccessDataResult<List<ContactMessage>>(contactMessages, "Contact messages retrieved successfully");
		}

		public IDataResult<ContactMessage> GetById(int id)
		{
			var contactMessage = _contactMessageDal.GetContactMessageById(id);
			if (contactMessage == null)
			{
				return new ErrorDataResult<ContactMessage>("Contact message not found");
			}
			return new SuccessDataResult<ContactMessage>(contactMessage, "Contact message retrieved successfully");
		}

		public IResult Update(ContactMessage contactMessage, int contactMessageId)
		{
			if (contactMessage == null)
			{
				return new ErrorResult("Contact message cannot be null");
			}
			var existingMessage = _contactMessageDal.GetContactMessageById(contactMessageId);
			if (existingMessage == null)
			{
				return new ErrorResult("Contact message not found");
			}
			_contactMessageDal.UpdateContactMessage(contactMessage, contactMessageId);
			return new SuccessResult("Contact message updated successfully");
		}
	}
}
