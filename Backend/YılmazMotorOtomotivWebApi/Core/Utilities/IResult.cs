﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YılmazMotorWeb.Core.Utilities
{
	public interface IResult
	{
		bool Success { get; }
		string Message { get; }

	}
}