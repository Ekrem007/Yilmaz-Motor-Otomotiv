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
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Concretes
{
	public class OrderService : IOrderService
	{
		private readonly IOrderDal _orderDal;
		private readonly ITaskService _taskService;
		private readonly IUserTaskService _userTaskService;
		private readonly IUserTaskDal _userTaskDal;
		private readonly IUserCouponCodeDal _userCouponCodeDal;
		private readonly ICouponDal _couponDal;

		public OrderService(
			IOrderDal orderDal,
			ITaskService taskService,
			IUserTaskService userTaskService,
			IUserTaskDal userTaskDal,
			IUserCouponCodeDal userCouponCodeDal,
			ICouponDal couponDal )
		{
			_orderDal = orderDal;
			_taskService = taskService;
			_userTaskService = userTaskService;
			_userTaskDal = userTaskDal;
			_userCouponCodeDal = userCouponCodeDal;
			_couponDal = couponDal;

		}

		public IResult Add(Order order)
		{
			if (order == null)
			{
				return new ErrorResult("Order cannot be null");
			}

			decimal total = 0;
			foreach (var item in order.OrderItems)
			{
				total += item.Price * item.Quantity;
			}
			order.TotalAmount = total;

			if (order.CouponCode.HasValue)
			{
				var userCoupon = _userCouponCodeDal.GetUserCouponCodeByCode(order.CouponCode.Value);
				if (userCoupon == null || userCoupon.IsUsed)
				{
					return new ErrorResult("Geçersiz veya daha önce kullanılmış kupon kodu.");
				}

				decimal discount = 0;
				if (userCoupon.Coupon != null)
				{
					discount = userCoupon.Coupon.DiscountAmount;
				}
				else if (userCoupon.CouponId.HasValue)
				{
					var coupon = _couponDal.GetCouponById(userCoupon.CouponId.Value);
					if (coupon != null)
						discount = coupon.DiscountAmount;
				}

				order.TotalAmount -= discount;
				if (order.TotalAmount < 0)
					order.TotalAmount = 0;

				userCoupon.IsUsed = true;
				userCoupon.UsedDate = DateTime.Now;
				_userCouponCodeDal.UpdateUserCouponCode(userCoupon.Id);
			}

			_orderDal.AddOrder(order);

			int userId = order.UserId;
			var allTasksResult = _taskService.GetAllTasks();

			if (!allTasksResult.Success || allTasksResult.Data == null)
			{
				return new SuccessResult("Order added successfully");
			}

			var allTasks = allTasksResult.Data;

			foreach (var taskDto in allTasks)
			{
				int taskId = taskDto.Id;
				var completedResult = _userTaskService.IsTaskCompletedByUser(taskId, userId);
				if (!completedResult.Success)
				{
					continue;
				}
				if (completedResult.Data)
				{
					continue;
				}
				if (order.TotalAmount >= taskDto.TargetAmount)
				{
					var userTask = new UserTask
					{
						UserId = userId,
						TaskId = taskId,
						CompletedDate = DateTime.Now
					};
					_userTaskDal.AddUserTask(userTask);

					var userCoupon = new UserCouponCode
					{
						UserId = userId,
						CouponId = taskDto.CouponId,
						CouponCode = Guid.NewGuid(),
						IsUsed = false,
						UsedDate = null
					};
					_userCouponCodeDal.AddUserCouponCode(userCoupon);
				}
			}

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
		public IDataResult<List<CategorySalesDto>> GetSalesValuesCategories()
		{
			var salesData = _orderDal.getSalesValuesCategories();
			if (salesData == null || !salesData.Any())
			{
				return new ErrorDataResult<List<CategorySalesDto>>("No sales data found");
			}
			return new SuccessDataResult<List<CategorySalesDto>>(salesData, "Category sales values retrieved successfully");
		}

	}
}
