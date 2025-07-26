using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWebApi.Controllers
{
	public class TicketReplyController : Controller
	{
		private readonly ITicketReplyService _ticketReplyService;
		public TicketReplyController(ITicketReplyService ticketReplyService)
		{
			_ticketReplyService = ticketReplyService;
		}

		[HttpGet]
		[Route("api/[controller]/getAll")]
		public IActionResult GetAll()
		{
			var result = _ticketReplyService.GetAll();
			if (result.Success)
				return Ok(result);
			return BadRequest(result);
		}
		[HttpPost]
		[Route("api/[controller]/add")]
		public IActionResult Add([FromBody] TicketReply ticketReply)
		{
			var result = _ticketReplyService.Add(ticketReply);
			if (result.Success)
				return Ok(result);
			return BadRequest(result);
		}

	}
}
