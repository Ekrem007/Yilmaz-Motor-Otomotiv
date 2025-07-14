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
	public class EFCategoryDal : ICategoryDal
	{
		private readonly YılmazMotorWebDbContext _context;
		public EFCategoryDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}
		public void Add(Category category)
		{
			_context.Categories.Add(category);
			_context.SaveChanges();
		}

		public void Delete(int categoryId)
		{
			var deleteCategory = _context.Categories.Find(categoryId);
			_context.Categories.Remove(deleteCategory);
			_context.SaveChanges();
		}

		public List<Category> GetAll()
		{
			return _context.Categories.ToList();
		}

		public Category GetById(int id)
		{
			return _context.Categories.FirstOrDefault(c => c.Id == id);
		}

		public void Update(Category category)
		{
			var existingCategory = _context.Categories.Find(category.Id);
			if (existingCategory != null)
			{
				existingCategory.Name = category.Name;
				existingCategory.Description = category.Description;

				_context.SaveChanges();
			}
			else
			{
				throw new Exception("Category not found");
			}

		}
	}
}
