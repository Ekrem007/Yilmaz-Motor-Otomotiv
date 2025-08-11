using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Dal
{
	public interface IUserDal
	{
		List<UserInfoDto> GetAllUsers();
	}
}
