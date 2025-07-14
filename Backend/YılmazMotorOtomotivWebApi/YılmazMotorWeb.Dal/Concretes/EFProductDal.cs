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
	public class EFProductDal : IProductDal
	{
		private readonly YılmazMotorWebDbContext _context;
		public EFProductDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}
		public void AddProduct(Product product)
		{
			_context.Products.Add(product);
			_context.SaveChanges();
		}

		public void DeleteProduct(int id)
		{
			var deleteProduct = _context.Products.Find(id);
			if (deleteProduct != null)
			{
				_context.Products.Remove(deleteProduct);
				_context.SaveChanges();
			}
			else
			{
				throw new Exception("Product not found");
			}
		}

		public List<Product> GetAllProducts()
		{
			return _context.Products.ToList();
		}

		public Product GetProductById(int id)
		{
			var product = _context.Products.FirstOrDefault(p => p.Id == id);
			if (product == null)
			{
				throw new Exception("Product not found");
			}
			return product;
		}

		public void UpdateProduct(Product product,int productId)
		{
			var existingProduct = _context.Products.Find(productId);
			if (existingProduct != null)
			{

				existingProduct.Name = product.Name;
				existingProduct.Description = product.Description;
				existingProduct.Price = product.Price;
				existingProduct.Stock = product.Stock;
				existingProduct.CategoryId = product.CategoryId;
				_context.SaveChanges();
			}
			else
			{
				throw new Exception("Product not found");
			}
		}
	}
}
