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
			if (!options.IsConfigured)
			{
				options.UseSqlServer("Server=DESKTOP-66LKAVD;Database=YılmazOtomotiv;Trusted_Connection=True;TrustServerCertificate=True;");
			}
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
		public DbSet<Ticket> Tickets { get; set; }
		public DbSet<TicketReply> TicketReplies { get; set; }
		public DbSet<Discount> Discounts { get; set; }
		public DbSet<UserCouponCode> UserCouponCodes { get; set; }
		public DbSet<Coupon> Coupons { get; set; }
		public DbSet<UserTask> UserTasks { get; set; }
		public DbSet<YılmazMotorWeb.Entities.Concretes.Task> Tasks { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{

			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<TicketReply>()
				.HasOne(tr => tr.Ticket)
				.WithMany(t => t.Replies)
				.HasForeignKey(tr => tr.TicketId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Ticket>()
				.HasOne(t => t.User)
				.WithMany()
				.HasForeignKey(t => t.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<TicketReply>()
				.HasOne(tr => tr.User)
				.WithMany()
				.HasForeignKey(tr => tr.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Discount>()
				.Property(d => d.IsActive)
				.HasComputedColumnSql("CAST(CASE WHEN GETDATE() BETWEEN StartDate AND EndDate THEN 1 ELSE 0 END AS bit)");
			modelBuilder.Entity<YılmazMotorWeb.Entities.Concretes.Task>()
				.HasOne(t => t.Coupon)
				.WithMany()
				.HasForeignKey(t => t.CouponId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<UserTask>()
				.HasOne(ut => ut.User)
				.WithMany(u => u.UserTasks)
				.HasForeignKey(ut => ut.UserId)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<UserTask>()
				.HasOne(ut => ut.Task)
				.WithMany(t => t.UserTasks)
				.HasForeignKey(ut => ut.TaskId)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<UserCouponCode>()
				.HasOne(uc => uc.User)
				.WithMany() 
				.HasForeignKey(uc => uc.UserId)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<UserCouponCode>()
				.HasOne(uc => uc.Coupon)
				.WithMany()
				.HasForeignKey(uc => uc.CouponId)
				.OnDelete(DeleteBehavior.Restrict);


		}
		public YılmazMotorWebDbContext() { }

	}
}
