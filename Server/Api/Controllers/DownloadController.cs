using Core.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DownloadController : ControllerBase
    {
        //private readonly IAmazonS3 _s3Client;
        private readonly IDownloadService _downloadService;
        public DownloadController(IDownloadService downloadService)
        {
            _downloadService = downloadService;
        }
        [Authorize]
        [HttpGet("download-url/{fileName}")]
        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            var downloadUrl = await _downloadService.GetDownloadUrlAsync(fileName);
            return downloadUrl;
        }
    }
}
