using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using YýlmazMotorWeb.Business.Abstracts;
using YýlmazMotorWeb.Business.Concretes;
using YýlmazMotorWeb.Dal.Abstracts;
using YýlmazMotorWeb.Dal.Concretes;
using YýlmazMotorWeb.Dal.Context;
using YýlmazMotorWeb.Entities.Identity;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
//CORS
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowSpecificOrigin", policy =>
	{
		policy.WithOrigins(
		   "http://localhost:4200",
		   "http://localhost:54673"
	   )
			 .AllowAnyMethod()
			  .AllowAnyHeader()
			  .AllowCredentials();
	});
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<YýlmazMotorWebDbContext>(options =>
	options.UseSqlServer("Server=DESKTOP-66LKAVD;Database=YýlmazOtomotiv;Trusted_Connection=True;TrustServerCertificate=True;"));

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductDal, EFProductDal>();

builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICategoryDal, EFCategoryDal>();

builder.Services.AddScoped<IContactMessageService, ContactMessageService>();
builder.Services.AddScoped<IContactMessageDal, EFContactMessageDal>();

builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderDal, EFOrderDal>();

builder.Services.AddScoped<IProductReviewService, ProductReviewService>();
builder.Services.AddScoped<IProductReviewDal, EFProductReviewDal>();

//Identity
builder.Services.AddIdentity<AppUser, AppRole>(options =>
{
	options.Password.RequireDigit = true;
	options.Password.RequiredLength = 6;
	options.Password.RequireNonAlphanumeric = false;
	options.Password.RequireUppercase = false;
	options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<YýlmazMotorWebDbContext>()
.AddDefaultTokenProviders();


var app = builder.Build();

app.UseCors("AllowSpecificOrigin");

if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
