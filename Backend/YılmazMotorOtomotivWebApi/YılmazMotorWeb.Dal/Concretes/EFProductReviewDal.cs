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
	public class EFProductReviewDal : IProductReviewDal
	{
		private readonly YılmazMotorWebDbContext _context;
		public EFProductReviewDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}
		public void AddReview(ProductReview review)
		{
			if (review == null)
			{
				throw new ArgumentNullException(nameof(review), "Review cannot be null");
			}
			_context.ProductReviews.Add(review);
			_context.SaveChanges();
		}

		public void DeleteReview(int id)
		{
			var review = _context.ProductReviews.Find(id);
			if (review == null)
			{
				throw new KeyNotFoundException($"Review with ID {id} not found");
			}
			_context.ProductReviews.Remove(review);
			_context.SaveChanges();
		}

		public List<ProductReviewDto> GetAllReviews()
		{
			return _context.ProductReviews
				.Include(r => r.Product)
				.Include(r => r.User)
				.Select(r => new ProductReviewDto
				{
					Id = r.Id,
					ProductId = r.ProductId,
					ProductName = r.Product != null ? r.Product.Name : null,
					UserId = r.UserId,
					UserName = r.User != null ? r.User.UserName : null,
					ReviewText = r.ReviewText,
					Rating = r.Rating,
					CreatedAt = r.CreatedAt
				})
				.ToList();
		}

		public ProductReview GetReviewById(int id)
		{
			var review = _context.ProductReviews.Find(id);
			if (review == null)
			{
				throw new KeyNotFoundException($"Review with ID {id} not found");
			}
			return review;
		}

		public void UpdateReview(ProductReview review, int productReviewId)
		{
			if (review == null)
			{
				throw new ArgumentNullException(nameof(review), "Review cannot be null");
			}
			var existingReview = _context.ProductReviews.Find(productReviewId);
			if (existingReview == null)
			{
				throw new KeyNotFoundException($"Review with ID {productReviewId} not found");
			}
			existingReview.Rating = review.Rating;
			existingReview.ReviewText = review.ReviewText;
			_context.SaveChanges();
		}
		public TopRatedProductDto GetTopRatedProduct()
		{
			var topRatedProduct = _context.ProductReviews
				.GroupBy(r => r.ProductId)
				.Select(g => new
				{
					ProductId = g.Key,
					AverageRating = g.Average(r => r.Rating),
					ProductName = g.Select(r => r.Product.Name).FirstOrDefault()
				})
				.OrderByDescending(x => x.AverageRating)
				.FirstOrDefault();
			if (topRatedProduct == null)
			{
				return null;
			}
			return new TopRatedProductDto
			{
				ProductName = topRatedProduct.ProductName,
				AverageRating = topRatedProduct.AverageRating,
				ReviewCount = _context.ProductReviews.Count(r => r.ProductId == topRatedProduct.ProductId)
			};
		}
	}
}
