﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Entities.Dtos
{
	public class UpdateUserDto
	{
		public string Email { get; set; }
		public string Name { get; set; }
		public string SurName { get; set; }
		public string PhoneNumber { get; set; }
		public string Address { get; set; }
	}
}
