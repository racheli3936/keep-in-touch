﻿using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.IServices
{
    public interface IAuthService
    {
        Task<(string token, User user)> LoginAsync(Login login);
        Task<string> RegisterUserAsync(User user);
        public string GenerateJwtToken(User user);
        Task<string> LoginAdminAsync(Login login);
    }
}
