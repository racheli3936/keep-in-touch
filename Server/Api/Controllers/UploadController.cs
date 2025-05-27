using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;

        public UploadController(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName, [FromQuery] string fileType)
        {
            Console.WriteLine("im here" + fileType);
            string contentType = fileType.ToLower() switch
            {
                "application/pdf" => "application/pdf",
                "pdf" => "application/pdf",
                "image/jpeg" => "image/jpeg",
                "jpeg" => "image/jpeg",
                "jpg" => "image/jpeg",
                "image/png" => "image/png", // הוספת תמיכה לקובצי PNG
                "png" => "image/png",       // הוספת תמיכה לקובצי PNG
                "application/msword" => "application/msword", // הוספת תמיכה לקובצי Word
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // עבור קובצי Word ב-Office 2007 ואילך
                "doc" => "application/msword", // הוספת תמיכה לקובצי Word
                "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // הוספת תמיכה לקובצי Word
                _ => "application/octet-stream" // ברירת מחדל לסוגים שאינם מזוהים
            };

            Console.WriteLine(contentType, " content type");
            var request = new GetPreSignedUrlRequest
            {
                BucketName = "keepintouch.testpnoren",
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(5),
                //ContentType = "image/jpeg" // או סוג הקובץ המתאים
                ContentType = contentType
            };

            string url = _s3Client.GetPreSignedURL(request);

            return Ok(new { url });
        }
    }
}
