using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWebApi.Controllers
{

	public class TicketController : ControllerBase
	{
		private readonly ITicketService _ticketService;

		public TicketController(ITicketService ticketService)
		{
			_ticketService = ticketService;
		}

		[HttpGet]
		[Route("api/[controller]/getAll")]
		public IActionResult GetAll()
		{
			var result = _ticketService.GetAllTickets();
			if (result.Success)
				return Ok(result);
			return BadRequest(result);
		}

		[HttpGet]
		[Route("api/[controller]/getById/{id}")]
		public IActionResult GetById(int id)
		{
			var result = _ticketService.GetTicketById(id);
			if (result.Success)
				return Ok(result);
			return NotFound(result);
		}


		[HttpGet]
		[Route("api/[controller]/getByUserId/{userId}")]
		public IActionResult GetByUserId(int userId)
		{
			var result = _ticketService.GetTicketsByUserId(userId);
			if (result.Success)
				return Ok(result);
			return BadRequest(result);
		}

		[HttpPost]
		[Route("api/[controller]/add")]
		public
			IActionResult Add([FromBody] Ticket ticket)
		{
			var result = _ticketService.AddTicket(ticket);
			if (result.Success)
				return Ok(result);
			return BadRequest(result);
		}

		[HttpPut]
		[Route("api/[controller]/update/{ticketId}")]
		public IActionResult Update([FromBody] Ticket ticket, int ticketId)
		{
			var result = _ticketService.UpdateTicket(ticket, ticketId);
			if (result.Success)
				return Ok(result);
			return BadRequest(result);
		}

		[HttpDelete]
		[Route("api/[controller]/delete/{id}")]
		public IActionResult Delete(int id)
		{
			var result = _ticketService.DeleteTicket(id);
			if (result.Success)
				return Ok(result);
			return BadRequest(result);
		}
		[HttpGet]
		[Route("api/[controller]/getTicketById/{ticketId}")]
		public IActionResult GetTicketById(int ticketId)
		{
			var result = _ticketService.GetTicketById(ticketId);
			if (result.Success)
				return Ok(result);
			return NotFound(result);
		}
		[HttpGet]
		[Route("api/[controller]/getOpenTicketCount")]
		public IActionResult GetOpenTicketCount()
		{
			var result = _ticketService.GetAllTickets();
			if (result.Success)
			{
				var openTicketsCount = result.Data.Count(t => t.Status == TicketStatus.Open);
				return Ok(new
				{
					Success = true,
					Message = "Open ticket count retrieved successfully.",
					Data = openTicketsCount
				});
			}
			return BadRequest(result);
		}
		[HttpGet]
		[Route("api/[controller]/getClosedTicketCount")]
		public IActionResult GetClosedTicketCount()
		{
			var result = _ticketService.GetAllTickets();
			if (result.Success)
			{
				var closedTicketsCount = result.Data.Count(t => t.Status == TicketStatus.Closed);
				return Ok(new
				{
					Success = true,
					Message = "Closed ticket count retrieved successfully.",
					Data = closedTicketsCount
				});
			}
			return BadRequest(result);
		}
		[HttpGet]
		[Route("api/[controller]/getAnsweredTicketCount")]
		public IActionResult GetAnsweredTicketCount()
		{
			var result = _ticketService.GetAllTickets();
			if (result.Success)
			{
				var answeredTicketsCount = result.Data.Count(t => t.Status == TicketStatus.Answered);
				return Ok(new
				{
					Success = true,
					Message = "Answered ticket count retrieved successfully.",
					Data = answeredTicketsCount
				});
			}
			return BadRequest(result);

		}
		[HttpPut]
		[Route("api/[controller]/changeStatus/{ticketId}")]
		public IActionResult ChangeStatus(int ticketId, [FromBody] TicketStatus status)
		{
			var result = _ticketService.ChangeTicketStatus(ticketId, status);
			if (result.Success)
				return Ok(result);
			return BadRequest(result);
		}
	}
}