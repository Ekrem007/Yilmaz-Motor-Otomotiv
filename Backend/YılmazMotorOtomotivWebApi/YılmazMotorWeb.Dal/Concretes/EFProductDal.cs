using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Dal.Context;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

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

		public List<ProductWithCategoryNameDto> GetAllProducts()
		{
			var products = _context.Products
				.Include(p => p.Category)
				.Select(p => new ProductWithCategoryNameDto
				{
					Id = p.Id,
					CategoryName = p.Category.Name,
					Name = p.Name,
					Description = p.Description,
					Price = p.Price,
					ImageUrl = p.ImageUrl,
					Stock = p.Stock
				}).ToList();
			if (products == null || !products.Any())
			{
				throw new Exception("No products found");
			}
			return products;

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

		public List<ProductWithCategoryNameDto> GetProductsByCategoryId(int categoryId)
		{
			var products = _context.Products
				.Include(p => p.Category)
				.Where(p => p.CategoryId == categoryId)
				.Select(p => new ProductWithCategoryNameDto
				{
					Id = p.Id,
					CategoryName = p.Category.Name,
					Name = p.Name,
					Description = p.Description,
					Price = p.Price,
					ImageUrl = p.ImageUrl,
					Stock = p.Stock
				}).ToList();
			if (products == null || !products.Any())
			{
				throw new Exception("No products found for the specified category");
			}
			return products;
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
				existingProduct.ImageUrl = product.ImageUrl;
				_context.SaveChanges();
			}
			else
			{
				throw new Exception("Product not found");
			}
		}
		public List<ProductWithCategoryNameDto> GetProductsByName(string name)
		{
			var products = _context.Products
				.Include(p => p.Category)
				.Where(p => p.Name.ToLower().Contains(name.ToLower()))
				.Select(p => new ProductWithCategoryNameDto
				{
					Id = p.Id,
					CategoryName = p.Category.Name,
					Name = p.Name,
					Description = p.Description,
					Price = p.Price,
					ImageUrl = p.ImageUrl,
					Stock = p.Stock
				}).ToList();


			return products;
		}

	}
}
