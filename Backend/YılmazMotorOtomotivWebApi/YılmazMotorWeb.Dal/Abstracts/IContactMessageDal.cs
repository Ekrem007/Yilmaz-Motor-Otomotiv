using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface IContactMessageDal
	{
		void AddContactMessage(ContactMessage contactMessage);
		void UpdateContactMessage(ContactMessage contactMessage, int contactMessageId);
		void DeleteContactMessage(int contactMessageId);
		ContactMessage GetContactMessageById(int id);
		List<ContactMessage> GetAllContactMessages();

	}
}
