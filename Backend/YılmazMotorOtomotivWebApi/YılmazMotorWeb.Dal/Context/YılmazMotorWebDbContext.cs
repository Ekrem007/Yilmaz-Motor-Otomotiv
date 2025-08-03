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

		}
		public YılmazMotorWebDbContext() { }

	}
}
