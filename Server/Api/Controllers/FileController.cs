using Api.PostModels;
using Core.IServices;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tesseract;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {

        private readonly IFileService _fileService;
        private readonly ITokenService _tokenService;
        private readonly IDownloadService _downloadService;

        public FileController(IFileService fileService, ITokenService tokenService, IDownloadService downloadService)
        {
            this._fileService = fileService;
            _tokenService = tokenService;
            _downloadService = downloadService;
        }

        // GET: api/file
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MyFile>>> GetFiles()
        {
            var files = await _fileService.GetAllFilesAsync();
            return Ok(files);
        }
        // GET: api/file/group/{groupId}
        [HttpGet("group/{groupId}")]
        public async Task<ActionResult<List<MyFile>>> GetFilesByGroupId(int groupId)
        {
            List<MyFile> files = await _fileService.GetFilesByGroupIdAsync(groupId);

            if (files == null || !files.Any())
            {
                return new List<MyFile>();
                //NotFound("No files found for the specified group.");
            }

            foreach (var file in files)
            {
                // עדכון ה-URL לכל קובץ
                file.FilePath = await _downloadService.GetDownloadUrlAsync(file.FileName);
            }

            return Ok(files);
        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<MyFile>> GetFile(int id)
        {

            var file = await _fileService.GetFileByIdAsync(id);
            if (file == null)
            {
                return NotFound();
            }
            return Ok(file);
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateFile([FromBody] FilePost filePost)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var userId = _tokenService.ExtractUserIdFromToken(token);

            if (filePost == null)
            {
                return BadRequest("File data is required.");
            }
            MyFile myFile = new MyFile()
            {
                FileName = filePost.FileName,
                FilePath = filePost.FilePath,
                FileSize = filePost.FileSize,
                Category = filePost.Category,
                Description = filePost.Description,
                Content = filePost.Content,
                FileType = filePost.FileType,
                EventDate = filePost.EventDate,
                GroupId = filePost.GroupId,
                UserId = userId
            };
            var result = await _fileService.CreateFileAsync(myFile);
            return Ok(result);
        }
        // PUT: api/file/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFile(int id, MyFile updatedFile)
        {
            if (id != updatedFile.Id)
            {
                return BadRequest();
            }

            var result = await _fileService.UpdateFileAsync(updatedFile);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
        [Authorize]
        [HttpPut("{fileId}/content")]
        public async Task<IActionResult> UpdateFileContent(int fileId, [FromBody] string newContent)
        {
            if (string.IsNullOrEmpty(newContent))
            {
                return BadRequest("New content is required.");
            }

            var result = await _fileService.UpdateFileContentAsync(fileId, newContent);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/file/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFile(int id)
        {
            var result = await _fileService.DeleteFileAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
        [HttpPost("readtext")]
        public async Task<IActionResult> ReadTextFromImage(string fileName)
        {
            Console.WriteLine("imwant to etract===========");
            string imageUrl = await _downloadService.GetDownloadUrlAsync(fileName);

            if (imageUrl == null /*|| image.Length == 0*/)
            {
                return BadRequest("No image provided.");
            }
            string fileType = imageUrl.Contains("jpg") ? ".jpg" : ".png";
            Console.WriteLine(fileType + "____filetype");
            string resultText;


            try
            {
                // הורדת התמונה מה-URL
                using (var httpClient = new HttpClient())
                {
                    var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
                    var tempFilePath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + fileType);

                    // שמירת התמונה בשרת
                    await System.IO.File.WriteAllBytesAsync(tempFilePath, imageBytes);

                    // קריאת הטקסט מהתמונה
                    resultText = ExtractTextFromImage(tempFilePath);

                    // מחיקת התמונה מהשרת לאחר השימוש
                    System.IO.File.Delete(tempFilePath);
                }
            }

            catch (Exception ex)
            {
                return StatusCode(500, $"Error processing image: {ex.Message}");
            }
            finally
            {
                // מחיקת התמונה מהשרת לאחר השימוש
                //System.IO.File.Delete(imageUrl);
            }

            return Ok(resultText);
        }

        private string ExtractTextFromImage(string imagePath)
        {
            using (var engine = new TesseractEngine(@"./tessdata", "heb", EngineMode.Default))
            {
                using (var img = Pix.LoadFromFile(imagePath))
                {
                    using (var page = engine.Process(img))
                    {
                        Console.WriteLine(page.GetText());
                        return page.GetText();
                    }
                }
            }
        }
    }
}
