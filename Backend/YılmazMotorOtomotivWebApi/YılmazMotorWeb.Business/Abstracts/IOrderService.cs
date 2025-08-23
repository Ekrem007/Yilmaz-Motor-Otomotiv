using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Concretes;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface IOrderService
	{
		IDataResult<List<OrderDto>> GetAll();
		IDataResult<Order> GetById(int id);
		IResult Add(Order order);
		IResult Update(Order order, int orderId);
		IResult Delete(int orderId);
		IDataResult<List<OrderDetailsDto>> GetOrderDetailsByOrderId(int orderId);
		IResult ChangeOrderStatus(int orderId, OrderStatus status);
		IDataResult<List<OrderDetailsDto>> GetOrdersByUserId(int userId);
		IDataResult<MostSellingProductDto> GetMostSellingProduct();
		IDataResult<int> GetTotalCompletedOrdersCount();
		IDataResult<int> GetTotalGainedMoney();
		IDataResult<List<CategorySalesDto>> GetSalesValuesCategories();

	}
}
