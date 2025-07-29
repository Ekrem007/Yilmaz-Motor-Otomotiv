using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Abstracts
{
	public interface IOrderDal
	{
		void AddOrder(Order order);
		void UpdateOrder(Order order, int orderId);
		void DeleteOrder(int id);
		Order GetOrderById(int id);
		List<OrderDto> GetAllOrders();
		List<OrderDetailsDto> GetOrderDetailsByOrderId(int orderId);
		void ChangeOrderStatus(int orderId, OrderStatus status);
		List<OrderDetailsDto> GetOrdersByUserId(int userId);
		MostSellingProductDto GetMostSellingProduct();
		int GetTotalCompletedOrdersCount();
		int GetTotalGainedMoney();


	}
}
