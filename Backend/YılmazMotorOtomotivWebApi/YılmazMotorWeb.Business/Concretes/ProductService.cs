using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Concretes
{
	public class ProductService : IProductService
	{
		private readonly IProductDal _productDal;
		public ProductService(IProductDal productDal)
		{
			_productDal = productDal;
		}
		public IDataResult<Product> Add(Product product)
		{
			_productDal.AddProduct(product);
			return new SuccessDataResult<Product>(product, "Product added successfully");
		}

		public IResult Delete(int productId)
		{
			_productDal.DeleteProduct(productId);
			return new SuccessResult("Product deleted successfully");
		}

		public IDataResult<List<ProductWithCategoryNameDto>> GetAll()
		{
			var products = _productDal.GetAllProducts();
			if (products == null || !products.Any())
			{
				return new ErrorDataResult<List<ProductWithCategoryNameDto>>("No products found");
			}
			return new SuccessDataResult<List<ProductWithCategoryNameDto>>(products, "Products retrieved successfully");
		}

		public IDataResult<Product> GetById(int id)
		{
			var product = _productDal.GetProductById(id);
			if (product == null)
			{
				return new ErrorDataResult<Product>("Product not found");
			}
			return new SuccessDataResult<Product>(product, "Product retrieved successfully");
		}

		public IDataResult<List<ProductWithCategoryNameDto>> GetProductsByCategoryId(int categoryId)
		{
			var products = _productDal.GetProductsByCategoryId(categoryId);
			if (products == null || !products.Any())
			{
				return new ErrorDataResult<List<ProductWithCategoryNameDto>>("No products found for the specified category");
			}
			return new SuccessDataResult<List<ProductWithCategoryNameDto>>(products, "Products retrieved successfully for the specified category");
		}

		public IResult Update(Product product, int productId)
		{
			if (product == null)
			{
				return new ErrorResult("Product cannot be null");
			}
			_productDal.UpdateProduct(product, productId);
			return new SuccessResult("Product updated successfully");
		}
		public IDataResult<List<ProductWithCategoryNameDto>> GetProductsByName(string name)
		{
			var products = _productDal.GetProductsByName(name);
			if (products == null || !products.Any())
			{
				return new ErrorDataResult<List<ProductWithCategoryNameDto>>("No products found with the specified name");
			}
			return new SuccessDataResult<List<ProductWithCategoryNameDto>>(products, "Products retrieved successfully by name");
		}
	}
}
