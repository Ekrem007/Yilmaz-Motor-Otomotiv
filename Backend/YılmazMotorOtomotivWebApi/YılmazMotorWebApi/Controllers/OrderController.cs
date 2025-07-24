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
	}
}
