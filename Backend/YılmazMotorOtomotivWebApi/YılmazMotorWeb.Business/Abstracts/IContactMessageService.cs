using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface IContactMessageService
	{
		IDataResult<List<ContactMessage>> GetAll();

		IDataResult<ContactMessage> GetById(int id);

		IResult Add(ContactMessage contactMessage);
		IResult Update(ContactMessage contactMessage, int contactMessageId);
		IResult Delete(int contactMessageId);
	}
}
