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
    public class MassageController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly IMassageService _massageService;
        public MassageController(ITokenService tokenService, IMassageService massageService)
        {
            _tokenService = tokenService;
            _massageService = massageService;
        }

        // GET: api/<MassageController>
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}


        [HttpGet("{groupId}/massages")]
        public async Task<ActionResult<List<Massage>>> GetMassagesByGroupId(int groupId)
        {
            var massages = await _massageService.GetMassagesByGroupId(groupId);
            if (massages == null || !massages.Any())
            {
                return NotFound("No messages found for this group.");
            }

            return Ok(massages);
        }

        // POST api/<MassageController>
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Massage>> AddMassageToGroup([FromBody] MassagePost massage)
        {
            string token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            int userId = _tokenService.ExtractUserIdFromToken(token);
            Massage massage1 = new Massage()
            {
                Content = massage.Content,
                GroupId = massage.GroupId,
                UserId = userId,
                CreatedDate = DateTime.Now,
                FontSize = massage.FontSize,
                Color = massage.Color
            };
            try
            {
                Massage massage2 = await _massageService.AddMassageToGroupAsync(massage1);
                return Ok(massage2);
            }
            catch (Exception ex)
            {
                return new Massage();
            }


        }
        [Authorize]
        [HttpDelete("{groupId}/{messageId}")]
        public async Task<IActionResult> DeleteMassage(int groupId, int messageId)
        {
            try
            {
                var result = await _massageService.DeleteMassageFromGroupAsync(groupId, messageId);
                if (!result)
                {
                    return NotFound("Message not found in this group.");
                }
                return NoContent(); // מחזיר 204 No Content במקרה של הצלחה
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
