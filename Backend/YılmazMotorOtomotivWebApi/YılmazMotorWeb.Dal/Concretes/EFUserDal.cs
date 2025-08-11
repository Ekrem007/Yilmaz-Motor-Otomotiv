using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Dal.Context;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal.Concretes
{
	public class EFUserDal : IUserDal
	{
		private readonly YılmazMotorWebDbContext _context;
		public EFUserDal(YılmazMotorWebDbContext context)
		{
			_context = context;
		}

		public List<UserInfoDto> GetAllUsers()
		{
			return _context.Users.Where(u => u.Id !=1).Select(u => new UserInfoDto
			{
				Id = u.Id,
				UserName = u.UserName,
				Email = u.Email,
				Name = u.Name,
				SurName = u.SurName,
				PhoneNumber = u.PhoneNumber,
				Address = u.Address
			}).ToList();
		}
	}
}
