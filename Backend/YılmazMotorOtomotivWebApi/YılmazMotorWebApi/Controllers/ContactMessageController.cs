using Microsoft.AspNetCore.Mvc;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Entities.Concretes;

namespace YılmazMotorWebApi.Controllers
{
	public class ContactMessageController : Controller
	{
		private readonly IContactMessageService _contactMessageService;
		public ContactMessageController(IContactMessageService contactMessageService)
		{
			_contactMessageService = contactMessageService;
		}
		public IActionResult Index()
		{
			return View();
		}
		[HttpGet]
		[Route("api/[controller]/getall")]
		public IActionResult GetAll()
		{
			var result = _contactMessageService.GetAll();
			return Ok(new
			{
				success = result.Success,
				message = result.Message,
				data = result.Data
			});
		}
		[HttpPost]
		[Route("api/[controller]/add")]
		public IActionResult Add([FromBody] ContactMessage contactMessage)
		{
			var result = _contactMessageService.Add(contactMessage);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}


		[HttpPut]
		[Route("api/[controller]/update/{contactMessageId}")]
		public IActionResult Update([FromBody] ContactMessage contactMessage, int contactMessageId)
		{
			var result = _contactMessageService.Update(contactMessage, contactMessageId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});

		}
		[HttpDelete]
		[Route("api/[controller]/delete/{contactMessageId}")]
		public IActionResult Delete(int contactMessageId)
		{
			var result = _contactMessageService.Delete(contactMessageId);
			return Ok(new
			{
				success = result.Success,
				message = result.Message
			});
		}
	}
}
