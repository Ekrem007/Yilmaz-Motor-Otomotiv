using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Dal.Abstracts;
using YılmazMotorWeb.Dal.Concretes;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWeb.Business.Concretes
{
	public class CategoryService : ICategoryService
	{
		private readonly ICategoryDal _categoryDal;

		public CategoryService(ICategoryDal categoryDal)
		{
			_categoryDal = categoryDal;
		}

		public IDataResult<Category> Add(Category category)
		{
			if (category == null)
			{
				return new ErrorDataResult<Category>("Category cannot be null");
			}
			_categoryDal.Add(category);
			return new SuccessDataResult<Category>(category, "Category added successfully");
		}

		public IResult Delete(int categoryId)
		{
			_categoryDal.Delete(categoryId);
			return new SuccessResult("Category deleted successfully");
		}

		public IDataResult<List<Category>> GetAll()
		{
			var categories = _categoryDal.GetAll();
			if (categories == null || !categories.Any())
			{
				return new ErrorDataResult<List<Category>>("No categories found");
			}
			return new SuccessDataResult<List<Category>>(categories, "Categories retrieved successfully");
		}

		public IDataResult<Category> GetById(int id)
		{
			var category = _categoryDal.GetById(id);
			if (category == null)
			{
				return new ErrorDataResult<Category>("Category not found");
			}
			return new SuccessDataResult<Category>(category, "Category retrieved successfully");
		}

		public IResult Update(Category category, int categoryId)
		{
			if (category == null)
			{
				return new ErrorResult("Category cannot be null");
			}
			var existingCategory = _categoryDal.GetById(categoryId);
			if (existingCategory == null)
			{
				return new ErrorResult("Category not found");
			}
			_categoryDal.Update(category, categoryId);
			return new SuccessResult("Category updated successfully");
		}
	}
}
