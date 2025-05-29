using Api.PostModels;
using AutoMapper;
using Core.DTOs;
using Core.IServices;
using Core.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        public AuthController(IAuthService authService, IUserService userService, IMapper mapper)
        {
            _authService = authService;
            _mapper = mapper;
        }

        [HttpPost("loginAdmin")]
        public async Task<IActionResult> LoginAdmin([FromBody] Login login)
        {
            var token = await _authService.LoginAdminAsync(login);
            try
            {
               
                Console.WriteLine(token);
                Console.WriteLine("token++");

                return Ok(new { Token = token });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login login)
        {
            try
            {
                var (token, user) = await _authService.LoginAsync(login);
                var dtoUser = _mapper.Map<UserDto>(user);
                return Ok(new { Token = token, User = dtoUser });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserPost userPost)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userPost.Password);

            var user = new User
            {
                Name = userPost.Name,
                Phone = userPost.Phone,
                Email = userPost.Email,
                Address = userPost.Address,
                PasswordHash = passwordHash,
                PreviousFamily = userPost.PreviousFamily
            };

            var token = await _authService.RegisterUserAsync(user);
            return Ok(new { Token = token });
        }
    }
}
