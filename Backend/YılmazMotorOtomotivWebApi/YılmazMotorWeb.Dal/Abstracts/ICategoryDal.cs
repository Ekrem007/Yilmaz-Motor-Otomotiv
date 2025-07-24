using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface ICategoryDal
	{
		void Add(Category category);
		Category GetById(int id);
		List<Category> GetAll();
		void Update(Category category, int categoryId);
		void Delete(int categoryId);
	}
}
