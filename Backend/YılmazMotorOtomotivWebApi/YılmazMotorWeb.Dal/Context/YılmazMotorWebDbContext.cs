using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Identity;

namespace YılmazMotorWeb.Dal.Context
{
	public class YılmazMotorWebDbContext : IdentityDbContext<AppUser, AppRole, int>
	{
		protected override void OnConfiguring(DbContextOptionsBuilder options)
		{
			options.UseSqlServer("Server=DESKTOP-66LKAVD;Database=YılmazOtomotiv;Trusted_Connection=True;TrustServerCertificate=True;");
		}
		public YılmazMotorWebDbContext(DbContextOptions<YılmazMotorWebDbContext> options)
			: base(options)
		{
		}
		public DbSet<Category> Categories { get; set; }
		public DbSet<Product> Products { get; set; }
		public DbSet<ProductReview> ProductReviews { get; set; }
		public DbSet<OrderItem> OrderItems { get; set; }
		public DbSet<Order> Orders { get; set; }
		public DbSet<ContactMessage> ContactMessages { get; set; }

	}
}
