using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface IProductDal
	{
		void AddProduct(Product product);
		void UpdateProduct(Product product,int productId);
		void DeleteProduct(int id);
		ProductWithCategoryNameDto GetProductById(int id);
		List<ProductWithCategoryNameDto> GetAllProducts();
		List<ProductWithCategoryNameDto> GetProductsByCategoryId(int categoryId);
		List<ProductWithCategoryNameDto> GetProductsByName(string name);
	}
}
