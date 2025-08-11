using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Abstracts
{
	public interface IUserService
	{
		IDataResult<List<UserInfoDto>> GetAllUsers();
	}
}
