using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface IProductService
	{
		IDataResult<List<Product>> GetAll();
		IDataResult<Product> GetById(int id);
		IDataResult<Product> Add(Product product);
		IResult Update(Product product, int productId);
		IResult Delete(int productId);
	}
}
