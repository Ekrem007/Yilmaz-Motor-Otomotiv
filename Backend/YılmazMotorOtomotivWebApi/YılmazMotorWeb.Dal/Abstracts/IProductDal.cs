using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface IProductDal
	{
		void AddProduct(Product product);
		void UpdateProduct(Product product,int productId);
		void DeleteProduct(int id);
		Product GetProductById(int id);
		List<Product> GetAllProducts();
	}
}
