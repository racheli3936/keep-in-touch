using Api.PostModels;
using AutoMapper;
using Core.DTOs;
using Core.IServices;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {

        private readonly IGroupService _groupService;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public GroupController(IGroupService groupService, ITokenService tokenService, IMapper mapper)
        {
            this._groupService = groupService;
            _tokenService = tokenService;
            _mapper = mapper;
        }
        // GET: api/groups/user/{userId}
        [Authorize]
        [HttpGet("user/groups")]
        public async Task<ActionResult<IEnumerable<GroupDto>>> GetGroupsByUser()
        {
            await Console.Out.WriteLineAsync("in");
            string token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            int userId = _tokenService.ExtractUserIdFromToken(token);
            Console.WriteLine(userId + "  userid");
            IEnumerable<Group> groups = await _groupService.GetGroupsByUserIdAsync(userId);
            Console.WriteLine(groups.Count() + "count in controler");
            IEnumerable<GroupDto> groupsDto = _mapper.Map<IEnumerable<GroupDto>>(groups);

            return Ok(groupsDto);
        }

        // GET: api/groups
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Group>>> GetAllGroups()
        //{
        //    var groups = await _groupService.GetAllGroupsAsync();
        //    return Ok(groups);
        //}

        //// GET: api/groups/{id}
        //[HttpGet("{id}")]
        //public async Task<ActionResult<Group>> GetGroupById(int id)
        //{
        //    var group = await _groupService.GetGroupByIdAsync(id);
        //    if (group == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(group);
        //}

        // POST: api/groups
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Group>> CreateGroup(GroupPost groupPost)
        {
            if (groupPost == null)
            {
                return BadRequest("Group cannot be null");
            }

            try
            {
                var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var userId = _tokenService.ExtractUserIdFromToken(token);
                Group groupToAdd = new Group()
                {
                    Name = groupPost.Name,
                    AdminId = userId,
                    password = groupPost.password,
                    Events = new List<MyFile>(),
                    GroupMembers = new List<GroupUser>()
                };
                await _groupService.AddGroupAsync(groupToAdd);
                return CreatedAtAction(nameof(CreateGroup), new { id = groupToAdd.Id }, groupToAdd);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize]
        [HttpPost("addUser")]
        public async Task<ActionResult<Group>> AddUserToGroup([FromBody] UserPostGroup userDetails)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadToken(userDetails.UserToken) as JwtSecurityToken;
            string userIdStr = jwtToken?.Claims.FirstOrDefault(claim => claim.Type == "unique_name")?.Value;
            if (userIdStr == null)
            {
                throw new InvalidOperationException("User ID claim not found in the token.");
            }
            int userId = int.Parse(userIdStr);
            try
            {
                await _groupService.AddUserToGroupAsync(userDetails.GroupId, userId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
