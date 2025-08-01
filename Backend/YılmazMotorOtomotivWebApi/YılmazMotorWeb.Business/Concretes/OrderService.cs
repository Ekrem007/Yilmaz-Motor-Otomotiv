﻿using System;
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
	public class OrderService : IOrderService
	{
		private readonly IOrderDal _orderDal;
		public OrderService(IOrderDal orderDal)
		{
			_orderDal = orderDal;
		}
		public IResult Add(Order order)
		{
			if (order == null)
			{
				return new ErrorResult("Order cannot be null");
			}
			_orderDal.AddOrder(order);
			return new SuccessResult("Order added successfully");
		}

		public IResult Delete(int orderId)
		{
			var order = _orderDal.GetOrderById(orderId);
			if (order == null)
			{
				return new ErrorResult("Order not found");
			}
			_orderDal.DeleteOrder(orderId);
			return new SuccessResult("Order deleted successfully");
		}

		public IDataResult<List<OrderDto>> GetAll()
		{
			var orders = _orderDal.GetAllOrders();
			if (orders == null || !orders.Any())
			{
				return new ErrorDataResult<List<OrderDto>>("No orders found");
			}
			return new SuccessDataResult<List<OrderDto>>(orders, "Orders retrieved successfully");
		}

		public IDataResult<Order> GetById(int id)
		{
			var order = _orderDal.GetOrderById(id);
			if (order == null)
			{
				return new ErrorDataResult<Order>("Order not found");
			}
			return new SuccessDataResult<Order>(order, "Order retrieved successfully");
		}
		public IResult Update(Order order, int orderId)
		{
			if (order == null)
			{
				return new ErrorResult("Order cannot be null");
			}
			var existingOrder = _orderDal.GetOrderById(orderId);
			if (existingOrder == null)
			{
				return new ErrorResult("Order not found");
			}
			_orderDal.UpdateOrder(order, orderId);
			return new SuccessResult("Order updated successfully");
		}
		public IDataResult<List<OrderDetailsDto>> GetOrderDetailsByOrderId(int orderId)
		{
			var orderDetails = _orderDal.GetOrderDetailsByOrderId(orderId);
			return new SuccessDataResult<List<OrderDetailsDto>>(orderDetails, "Order details retrieved successfully");
		}
		public IResult ChangeOrderStatus(int orderId, OrderStatus status)
		{
			var order = _orderDal.GetOrderById(orderId);
			if (order == null)
			{
				return new ErrorResult("Order not found");
			}
			_orderDal.ChangeOrderStatus(orderId, status);
			return new SuccessResult("Order status changed successfully");
		}
		public IDataResult<List<OrderDetailsDto>> GetOrdersByUserId(int userId)
		{
			var orders = _orderDal.GetOrdersByUserId(userId);
			if (orders == null || !orders.Any())
			{
				return new ErrorDataResult<List<OrderDetailsDto>>("No orders found for this user");
			}
			return new SuccessDataResult<List<OrderDetailsDto>>(orders, "Orders retrieved successfully");
		}
		public IDataResult<MostSellingProductDto> GetMostSellingProduct()
		{
			var mostSellingProduct = _orderDal.GetMostSellingProduct();
			if (mostSellingProduct == null)
			{
				return new ErrorDataResult<MostSellingProductDto>("No sales data found");
			}
			return new SuccessDataResult<MostSellingProductDto>(mostSellingProduct, "Most selling product retrieved successfully");
		}
		public IDataResult<int> GetTotalCompletedOrdersCount()
		{
			var count = _orderDal.GetTotalCompletedOrdersCount();
			return new SuccessDataResult<int>(count, "Total completed orders count retrieved successfully");
		}
		public IDataResult<int> GetTotalGainedMoney()
		{
			var totalMoney = _orderDal.GetTotalGainedMoney();
			return new SuccessDataResult<int>(totalMoney, "Total gained money retrieved successfully");
		}

	}
}
