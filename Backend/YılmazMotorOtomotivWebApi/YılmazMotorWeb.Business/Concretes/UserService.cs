using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YılmazMotorWeb.Business.Abstracts;
using YılmazMotorWeb.Core.Utilities;
using YılmazMotorWeb.Dal;
using YılmazMotorWeb.Entities.Dtos;

namespace YılmazMotorWeb.Business.Concretes
{
	public class UserService : IUserService
	{
		private readonly IUserDal _userDal;
		public UserService(IUserDal userDal)
		{
			_userDal = userDal;
		}
		public IDataResult<List<UserInfoDto>> GetAllUsers()
		{
			var users = _userDal.GetAllUsers();
			return new SuccessDataResult<List<UserInfoDto>>(users);
		}
	}
	
}

