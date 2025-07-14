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
	public class EFOrderDal : IOrderDal
	{
		private readonly YılmazMotorWebDbContext _context;
		public EFOrderDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}
		public void AddOrder(Order order)
		{
			if (order == null)
				throw new ArgumentNullException(nameof(order));

			foreach (var item in order.OrderItems)
			{
				var product = _context.Products.FirstOrDefault(p => p.Id == item.ProductId);
				if (product == null)
					throw new Exception($"Product with ID {item.ProductId} not found.");

				item.Price = product.Price; 
			}

			order.TotalAmount = order.OrderItems?.Sum(item => item.Price * item.Quantity) ?? 0;

			_context.Orders.Add(order);
			_context.SaveChanges();
		}

		public void DeleteOrder(int id)
		{
			var order = _context.Orders.Find(id);
			if (order != null)
			{
				_context.Orders.Remove(order);
				_context.SaveChanges();
			}
			else
			{
				throw new Exception("Order not found");
			}
		}

		public List<OrderDto> GetAllOrders()
		{
			return _context.Orders
				.Include(o => o.OrderItems)
				.Select(o => new OrderDto
				{
					Id = o.Id,
					UserId = o.UserId,
					TotalAmount = o.TotalAmount,
					OrderDate = o.OrderDate,
					Status = o.Status.ToString(),
					OrderItems = o.OrderItems.Select(oi => new OrderItemDto
					{
						Id = oi.Id,
						ProductId = oi.ProductId,
						Quantity = oi.Quantity,
						Price = oi.Price
					}).ToList()
				}).ToList();
		}

		public Order GetOrderById(int id)
		{
			return _context.Orders.Include(o => o.OrderItems).Include(o => o.User).FirstOrDefault(o => o.Id == id);
		}

		public void UpdateOrder(Order order, int orderId)
		{
			var existingOrder = _context.Orders.Find(orderId);
			if (existingOrder != null)
			{
				existingOrder.UserId = order.UserId;
				existingOrder.OrderDate = order.OrderDate;
				existingOrder.Status = order.Status;
				existingOrder.OrderItems = order.OrderItems;
				_context.SaveChanges();
			}
			else
			{
				throw new Exception("Order not found");
			}
		}
	}
}
