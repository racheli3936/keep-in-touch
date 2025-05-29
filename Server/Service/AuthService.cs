using Core.IRepositories;
using Core.IServices;
using Core.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class AuthService:IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;
        public AuthService(IAuthRepository authRepository, IConfiguration configuration)
        {
            _authRepository = authRepository;
            _configuration = configuration;
        }
        public async Task<string> LoginAdminAsync(Login login)
        {
            User user=await _authRepository.GetUserByEmailAndPasswordAsync(login.Email,login.Password);
            if(user==null)
            {
                throw new UnauthorizedAccessException("Invalid credentials.");
            }
            bool isUserAdmin =await _authRepository.IsUserAdminastator(user);
            if (!isUserAdmin) { throw new UnauthorizedAccessException("Invalid credentials."); }

            var tokenString = GenerateJwtToken(user);
            return tokenString;
        }
        public async Task<(string token, User user)> LoginAsync(Login login)
        {
            Console.WriteLine("IN LOGIN");
            var user = await _authRepository.GetUserByEmailAndPasswordAsync(login.Email, login.Password);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid credentials.");
            }
            var tokenString = GenerateJwtToken(user);
            return (tokenString, user);
        }
        public async Task<string> RegisterUserAsync(User user)
        {
            await _authRepository.CreateUserAsync(user);
            return GenerateJwtToken(user);
        }
        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim("aud", _configuration["Jwt:Audience"])
                }),
                Expires = DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["Jwt:ExpiryInDays"])),
                Issuer = _configuration["Jwt:Issuer"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
