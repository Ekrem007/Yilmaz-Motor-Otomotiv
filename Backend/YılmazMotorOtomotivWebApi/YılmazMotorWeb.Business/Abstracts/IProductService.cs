using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface IProductService
	{
		IDataResult<List<ProductWithCategoryNameDto>> GetAll();
		IDataResult<ProductWithCategoryNameDto> GetById(int id);
		IDataResult<Product> Add(Product product);
		IResult Update(Product product, int productId);
		IResult Delete(int productId);
		IDataResult<List<ProductWithCategoryNameDto>> GetProductsByCategoryId(int categoryId);
		IDataResult<List<ProductWithCategoryNameDto>> GetProductsByName(string name);
		IResult AddStockToProduct(int productId, int quantity);
	}
}
