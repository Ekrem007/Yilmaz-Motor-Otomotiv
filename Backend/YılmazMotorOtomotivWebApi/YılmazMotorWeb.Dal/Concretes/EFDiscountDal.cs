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
	public class EFDiscountDal : IDiscountDal
	{
		private readonly YılmazMotorWebDbContext _context;
		public EFDiscountDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}
		public void AddDiscount(Discount discount)
		{
			if (discount == null)
				throw new ArgumentNullException(nameof(discount), "Discount cannot be null");
			if (discount.EndDate <= discount.StartDate)
				throw new ArgumentException("End date must be greater than start date");

			var hasActiveDiscount = _context.Discounts
				.Any(d => d.ProductId == discount.ProductId && d.IsActive);

			if (hasActiveDiscount)
				throw new InvalidOperationException("This product already has an active discount.");

			_context.Discounts.Add(discount);
			_context.SaveChanges();
		}

		public void DeleteDiscount(int discountId)
		{
			var discount = _context.Discounts.Find(discountId);
			if (discount == null)
			{
				throw new KeyNotFoundException($"Discount with ID {discountId} not found");
			}
			_context.Discounts.Remove(discount);
			_context.SaveChanges();
		}

		public List<DiscountedProdutDto> GetAllDiscounts()
		{
			var discounts = _context.Discounts
				.Include(d => d.Product)
				.Include(d => d.Product.Category)
				.Where(d => d.IsActive == true)
				.Select(d => new DiscountedProdutDto
				{
					ProductId = d.Product.Id,
					ProductName = d.Product.Name,
					CategoryName = d.Product.Category.Name,
					ProductDescription = d.Product.Description,
					OriginalPrice = d.Product.Price,
					DiscountRate = d.Rate,
					ProductStock = d.Product.Stock,
					DiscountedPrice = d.Product.Price - (d.Product.Price * d.Rate / 100),
					ImageUrl = d.Product.ImageUrl,
					Stock = d.Product.Stock,
					DiscountStartDate = d.StartDate,
					DiscountEndDate = d.EndDate,
				})
				.ToList();
			return discounts;

		}

		public Discount GetDiscountById(int discountId)
		{
			var discount = _context.Discounts.Find(discountId);
			if (discount == null)
			{
				throw new KeyNotFoundException($"Discount with ID {discountId} not found");
			}
			return discount;
		}

		public void UpdateDiscount(Discount discount, int discountId)
		{
			if (discount == null)
			{
				throw new ArgumentNullException(nameof(discount), "Discount cannot be null");
			}
			if (discountId <= 0)
			{
				throw new ArgumentException("Discount ID must be greater than zero", nameof(discountId));
			}
			var existingDiscount = _context.Discounts.Find(discountId);
			if (existingDiscount == null)
			{
				throw new KeyNotFoundException($"Discount with ID {discountId} not found");
			}
			existingDiscount.EndDate = discount.EndDate;
			existingDiscount.Rate = discount.Rate;
			_context.SaveChanges();
		}
	}
}
