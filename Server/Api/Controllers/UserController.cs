using Api.PostModels;
using Core.IServices;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
        private readonly ITokenService _tokenService;
        public UserController(IUserService userService, IAuthService authService, ITokenService tokenService)
        {
            _userService = userService;
            _authService = authService;
            _tokenService = tokenService;
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _userService.GetUsersListAsync();
            if (users == null || !users.Any())
            {
                return NotFound();
            }
            return Ok(users);
        }

        // GET: api/<UsersController>
        [Authorize]
        [HttpGet("group/{groupId}")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsersByGroupId(int groupId)
        {
            var users = await _userService.GetUsersByGroupIdAsync(groupId);
            if (users == null || !users.Any())
            {
                return NotFound();
            }
            return Ok(users);
        }


        // GET api/<UsersController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }
        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound();
            }
            string token = _authService.GenerateJwtToken(user);
            return Ok(new { Token = token, User = user });
        }
        // POST: api/<UsersController>
        [HttpPost]
        public ActionResult<User> Post([FromBody] UserPost userPost)
        {
            if (userPost == null)
            {
                return BadRequest();
            }
            User userToAdd = new User()
            {
                Name = userPost.Name,
                Phone = userPost.Phone,
                Email = userPost.Email,
                Address = userPost.Address,
                PasswordHash = userPost.Password,
                PreviousFamily = userPost.PreviousFamily,
            };
            _userService.AddUser(userToAdd);
            return CreatedAtAction(nameof(Get), new { id = userToAdd.Id }, userToAdd);
        }
        [HttpPost("addNew")]
        public async Task<IActionResult> AddNewUserToGroup([FromBody] UserPost newUser, int groupId)
        {
            //User userToAdd = new User()
            //{
            //    Name = newUser.Name,
            //    Phone = newUser.Phone,
            //    Email = newUser.Email,
            //    Address = newUser.Address,
            //    PasswordHash = .Password,
            //    PreviousFamily = userPost.PreviousFamily,
            //};
            //await _userService.AddUserToGroupAsync(groupId);
            return Ok();
        }

        [HttpPost("addExists")]
        public async Task<IActionResult> AddExistsUserToGroup([FromBody] Login login)
        {
            //  await _userService.AddUserToGroupAsync(request.GroupId, request.UserId, request.Role);
            return Ok();
        }

        [HttpPut("updateUser/{id}")]
        public IActionResult Put(string token, [FromBody] User user)
        {
            //if (id != user.Id)
            //{
            //    return BadRequest();
            //}

            //var existingUser = _userService.GetUserById(id);
            //if (existingUser == null)
            //{
            //    return NotFound();
            //}

            _userService.UpdateUser(token, user);
            return NoContent();
        }
        [Authorize]
        [HttpPut]//המעודכן
        public async Task<IActionResult> UpdateUser([FromBody] UserPost userUpdate)
        {
            if (userUpdate == null)
            {
                return BadRequest();
            }
            string token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            int userId = _tokenService.ExtractUserIdFromToken(token);
            string passwordHash = "";
            if (userUpdate.Password != "")
            {
                passwordHash = BCrypt.Net.BCrypt.HashPassword(userUpdate.Password);
            }

            User user = new User()
            {
                Id = userId,
                Name = userUpdate.Name,
                Phone = userUpdate.Phone,
                Email = userUpdate.Email,
                Address = userUpdate.Address,
                PasswordHash = passwordHash,
                PreviousFamily = userUpdate.PreviousFamily,
            };
            var result = await _userService.UpdateUserAsync(userId, user);
            if (result == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _userService.DeleteUser(id);
            return NoContent();
        }
        [HttpDelete("remove-from-group")]
        public async Task<IActionResult> RemoveUserFromGroup(string email, int groupId)
        {
            var result = await _userService.RemoveUserFromGroupByEmailAsync(email, groupId);
            if (result)
            {
                return Ok("User removed from group successfully.");
            }
            return NotFound("User or group not found.");
        }
    }
}
