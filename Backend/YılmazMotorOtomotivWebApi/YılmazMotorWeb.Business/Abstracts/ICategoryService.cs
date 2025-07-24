using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface ICategoryService
	{
		IDataResult<List<Category>> GetAll();

		IDataResult<Category> GetById(int id);

		IDataResult<Category> Add(Category category);
		IResult Update(Category category, int categoryId);
		IResult Delete(int categoryId);
	}
}

