using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        public MailController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpPost]
        [Route("api/send-email")]
        public IActionResult SendEmail([FromBody] EmailRequest request)
        {
            try
            {
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential(_configuration["Email:address"], _configuration["Email:password"]),
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_configuration["Email:address"]),
                    Subject = request.Subject,
                    Body = request.Body,
                    IsBodyHtml = true,
                };
                mailMessage.To.Add(request.To);

                smtpClient.Send(mailMessage);
                return Ok("Email sent successfully");
            }
            catch (SmtpException smtpEx)
            {
                return BadRequest($"SMTP error: {smtpEx.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }
    }
    public class EmailRequest
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
