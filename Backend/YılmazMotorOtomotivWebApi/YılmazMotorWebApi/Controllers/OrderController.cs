using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWebApi.Controllers
{
	public class OrderController : Controller
	{
		private readonly IOrderService _orderService;
		public OrderController(IOrderService orderService)
		{
			_orderService = orderService;
		}
		[HttpGet]
		[Route("api/[controller]/getall")]
		public IActionResult GetAll()
		{
			var result = _orderService.GetAll();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
		[HttpPost]
		[Route("api/[controller]/add")]
		public IActionResult Add([FromBody] Order order)
		{
			var result = _orderService.Add(order);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}
		[HttpPut]
		[Route("api/[controller]/update/{orderId}")]
		public IActionResult Update([FromBody] Order order, int orderId)
		{
			var result = _orderService.Update(order, orderId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}
		[HttpDelete]
		[Route("api/[controller]/delete/{orderId}")]
		public IActionResult Delete(int orderId)
		{
			var result = _orderService.Delete(orderId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}
		[HttpGet]
		[Route("api/[controller]/getOrderDetailByOrderId/{orderId}")]
		public IActionResult GetOrderDetailByOrderId(int orderId)
		{
			var result = _orderService.GetOrderDetailsByOrderId(orderId);
			if (result.Success)
			{
				return Ok(new
				{
					success = result.Success,
					message = result.Message,
					data = result.Data
				});
			}
			else
			{
				return NotFound(new
				{
					success = result.Success,
					message = result.Message
				});
			}
		}
		[HttpPut]
		[Route("api/[controller]/changeOrderStatus/{orderId}")]
		public IActionResult ChangeOrderStatus(int orderId, [FromQuery] OrderStatus status)
		{
			var result = _orderService.ChangeOrderStatus(orderId, status);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}
		[HttpGet]
		[Route("api/[controller]/getOrdersByUserId/{userId}")]
		public IActionResult GetOrdersByUserId(int userId)
		{
			var result = _orderService.GetOrdersByUserId(userId);
			if (result.Success)
			{
				return Ok(new
				{
					success = result.Success,
					message = result.Message,
					data = result.Data
				});
			}
			else
			{
				return NotFound(new
				{
					success = result.Success,
					message = result.Message
				});
			}
		}
		[HttpGet]
		[Route("api/[controller]/getMostSellingProduct")]
		public IActionResult GetMostSellingProduct()
		{
			var result = _orderService.GetMostSellingProduct();
			if (result.Success)
			{
				return Ok(new
				{
					success = result.Success,
					message = result.Message,
					data = result.Data
				});
			}
			else
			{
				return NotFound(new
				{
					success = result.Success,
					message = result.Message
				});
			}
		}
		[HttpGet]
		[Route("api/[controller]/getTotalCompletedOrdersCount")]
		public IActionResult GetMostBuyingProduct()
		{
			var result = _orderService.GetAll();
			if (result.Success)
			{
				return Ok(new
				{
					success = true,
					message = "Total completed orders count retrieved successfully.",
					data = result.Data
				});
			}
			else
			{
				return NotFound(new
				{
					success = false,
					message = result.Message
				});
			}
		}
		[HttpGet]
		[Route("api/[controller]/getTotalGainedMoney")]
		public IActionResult GetTotalGainedMoney()
		{
			var result = _orderService.GetTotalGainedMoney();
			if (result.Success)
			{
				return Ok(new
				{
					success = true,
					message = "Total gained money retrieved successfully.",
					data = result.Data
				});
			}
			else
			{
				return NotFound(new
				{
					success = false,
					message = result.Message
				});
			}
		}
		[HttpGet]
		[Route("api/[controller]/getPendigOrdersCount")]
		public IActionResult GetPendingOrders()
		{
			var result = _orderService.GetAll();
			if (result.Success)
			{
				var pendingOrders = result.Data.Where(o => o.Status == OrderStatus.Pending.ToString()).Count();
				return Ok(new
				{
					success = true,
					message = "Pending orders retrieved successfully.",
					data = pendingOrders
				});
			}
			else
			{
				return NotFound(new
				{
					success = false,
					message = result.Message
				});
			}
		}
		[HttpGet]
		[Route("api/[controller]/getAllOrdersCount")]
		public IActionResult GetAllOrdersCount()
		{
			var result = _orderService.GetAll();
			if (result.Success)
			{
				return Ok(new
				{
					success = true,
					message = "All orders count retrieved successfully.",
					data = result.Data.Count
				});
			}
			else
			{
				return NotFound(new
				{
					success = false,
					message = result.Message
				});
			}
		}
		[HttpGet]
		[Route("api/[controller]/getLastMonthEarnings")]
		public IActionResult GetLastMonthEarnings()
		{
			var result = _orderService.GetAll();
			if (result.Success)
			{
				var lastMonth = DateTime.Now.AddMonths(-1);
				var total = result.Data
					.Where(o => o.Status != OrderStatus.Cancelled.ToString() && o.OrderDate >= lastMonth)
					.Sum(o => o.TotalAmount);

				return Ok(new
				{
					success = true,
					message = "Last month's earnings calculated successfully.",
					data = total
				});
			}
			else
			{
				return NotFound(new
				{
					success = false,
					message = result.Message
				});
			}
		}
		[HttpGet]
		[Route("api/[controller]/getAverageOrderAmount")]
		public IActionResult GetAverageOrderAmount()
		{
			var result = _orderService.GetAll();
			if (result.Success && result.Data.Any())
			{
				var validOrders = result.Data.Where(o => o.Status != OrderStatus.Cancelled.ToString());
				var average = validOrders.Average(o => o.TotalAmount);
				return Ok(new
				{
					success = true,
					message = "Average order amount calculated successfully.",
					data = average
				});
			}
			else
			{
				return Ok(new
				{
					success = true,
					message = "No orders found.",
					data = 0
				});
			}
		}
		[HttpGet]
		[Route("api/[controller]/getLastWeekEarnings")]
		public IActionResult GetLastWeekEarnings()
		{
			var result = _orderService.GetAll();
			if (result.Success && result.Data.Any())
			{
				var oneWeekAgo = DateTime.Now.AddDays(-7);
				var lastWeekEarnings = result.Data
					.Where(o => o.Status != OrderStatus.Cancelled.ToString() && o.OrderDate >= oneWeekAgo)
					.Sum(o => o.TotalAmount);

				return Ok(new
				{
					success = true,
					message = "Last week's earnings calculated successfully.",
					data = lastWeekEarnings
				});
			}
			else
			{
				return Ok(new
				{
					success = true,
					message = "No orders found.",
					data = 0
				});
			}
		}
		[HttpGet]
		[Route("api/[controller]/getMonthlySalesForLastYear")]
		public IActionResult GetMonthlySalesForLastYear()
		{
			var result = _orderService.GetAll();
			if (result.Success && result.Data.Any())
			{
				var now = DateTime.Now;
				var startMonth = new DateTime(now.Year, now.Month, 1).AddMonths(-11);

				var orders = result.Data
					.Where(o => !string.Equals(o.Status, OrderStatus.Cancelled.ToString(), StringComparison.OrdinalIgnoreCase)&& o.OrderDate >= startMonth)
					.ToList();

				var monthlySales = Enumerable.Range(0, 12)
					.Select(i =>
					{
						var month = startMonth.AddMonths(i);
						var monthOrders = orders.Where(o => o.OrderDate.Year == month.Year && o.OrderDate.Month == month.Month);
						return new
						{
							month = month.ToString("yyyy-MM"),
							totalSales = monthOrders.Sum(o => o.TotalAmount)
						};
					})
					.ToList();

				return Ok(new
				{
					success = true,
					message = "Monthly sales for last year (including current month) retrieved successfully.",
					data = monthlySales
				});
			}
			else
			{
				return Ok(new
				{
					success = true,
					message = "No orders found.",
					data = new List<object>()
				});
			}
		}
		[HttpGet]
		[Route("api/[controller]/getDailySalesForLastWeek")]
		public IActionResult GetDailySalesForLastWeek()
		{
			var result = _orderService.GetAll();
			if (result.Success && result.Data.Any())
			{
				var today = DateTime.Today;
				var startDay = today.AddDays(-6); 

				var orders = result.Data
					.Where(o => !string.Equals(o.Status, OrderStatus.Cancelled.ToString(), StringComparison.OrdinalIgnoreCase)&& o.OrderDate.Date >= startDay)
					.ToList();

				var dailySales = Enumerable.Range(0, 7)
					.Select(i =>
					{
						var day = startDay.AddDays(i);
						var dayOrders = orders.Where(o => o.OrderDate.Date == day);
						return new
						{
							day = day.ToString("yyyy-MM-dd"),
							totalSales = dayOrders.Sum(o => o.TotalAmount)
						};
					})
					.ToList();

				return Ok(new
				{
					success = true,
					message = "Daily sales for last week (including today) retrieved successfully.",
					data = dailySales
				});
			}
			else
			{
				return Ok(new
				{
					success = true,
					message = "No orders found.",
					data = new List<object>()
				});
			}
		}
		[HttpGet]
		[Route("api/[controller]/getCategorySalesCount")]
		public IActionResult GetCategorySalesCount()
		{
			var result = _orderService.GetSalesValuesCategories();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});

			
		}


	}
}
