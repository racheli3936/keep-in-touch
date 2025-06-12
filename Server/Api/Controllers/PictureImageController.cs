using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PictureImageController : ControllerBase
    {
        private readonly HttpClient _httpClient= new HttpClient();
        private readonly string _openAiApiKey;

        public PictureImageController( IConfiguration configuration)
        {
            //_httpClient = httpClient;
            _openAiApiKey = configuration["OpenAIKey"] ?? throw new ArgumentNullException("OpenAI API Key (API_KEY) not configured in environment variables.");
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateImage([FromBody] ImageRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Prompt))
                {
                    return BadRequest(new { error = "Prompt is required" });
                }

                string promptEn = await TranslateToEnglish(request.Prompt);

                // Prepare OpenAI API request for DALL-E
                var dalleRequest = new
                {
                    prompt = promptEn,
                    n = 1,
                    size = "1024x1024" // שונה ל-1024x1024 עבור DALL-E 3
                };

                var json = System.Text.Json.JsonSerializer.Serialize(dalleRequest);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_openAiApiKey}");

                var response = await _httpClient.PostAsync("https://api.deepai.org/api/text2img", content);
                //var response = await _httpClient.PostAsync("https://api.openai.com/v1/images/generations", content);
             

                if (!response.IsSuccessStatusCode)
                {
                    var errorResponseContent = await response.Content.ReadAsStringAsync();
                  
                    return StatusCode((int)response.StatusCode, new { error = "DALL-E API error", details = errorResponseContent });
                }

                var responseContent = await response.Content.ReadAsStringAsync();

                // תיקון ה-Deserialization עם אפשרויות נכונות
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var dalleResponse = System.Text.Json.JsonSerializer.Deserialize<DalleResponse>(responseContent, options);

                string? imageUrl = dalleResponse?.Data?.FirstOrDefault()?.Url;

                if (string.IsNullOrEmpty(imageUrl))
                {
                    return StatusCode(500, new { error = "Failed to generate image: No URL in response." });
                }

                return Ok(imageUrl);
                // Download the image
                //_logger.LogInformation($"Attempting to download image from: {imageUrl}");
                //var imageResponse = await _httpClient.GetAsync(imageUrl);
                //_logger.LogInformation($"Image download response status: {imageResponse.StatusCode}");
                //imageResponse.EnsureSuccessStatusCode();

                //var imageBytes = await imageResponse.Content.ReadAsByteArrayAsync();

                //return File(imageBytes, "image/png", "generated_image.png");
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, new { error = $"API request failed: {ex.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Internal server error: {ex.Message}" });
            }
        }
        private async Task<string> TranslateToEnglish(string text)
        {
            try
            {
                string url = "https://api.openai.com/v1/chat/completions";

                var translateRequest = new
                {
                    model = "gpt-3.5-turbo",
                    messages = new[]
                    {
                        new { role = "system", content = "You are a translator. Translate the given text to English and return ONLY the translated text, nothing else." },
                        new { role = "user", content = text }
                    },
                    max_tokens = 100,
                    temperature = 0
                };

                var json = System.Text.Json.JsonSerializer.Serialize(translateRequest);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_openAiApiKey}");
                //_httpClient.DefaultRequestHeaders.Add("Api-Key", _openAiApiKey);
                var response = await _httpClient.PostAsync(url, content);
              
                if (!response.IsSuccessStatusCode)
                {
                    var errorResponseContent = await response.Content.ReadAsStringAsync();
                    return text;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
  

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var openAiResponse = System.Text.Json.JsonSerializer.Deserialize<OpenAIChatCompletionResponse>(responseContent, options);
                string? translatedText = openAiResponse?.Choices?.FirstOrDefault()?.Message?.Content?.Trim();

                if (!string.IsNullOrEmpty(translatedText))
                {
                    // הסרת ציטוטים אם קיימים
                    if (translatedText.StartsWith("\"") && translatedText.EndsWith("\""))
                    {
                        translatedText = translatedText.Substring(1, translatedText.Length - 2);
                    }

                    return translatedText;
                }
                return text;
            }
            catch (Exception ex)
            {
                return text;
            }
        }
    }

    // Request/Response models
    public class ImageRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }

    public class DalleResponse
    {
        public List<DalleImageData>? Data { get; set; }
    }

    public class DalleImageData
    {
        public string? Url { get; set; }
    }

    public class OpenAIChatCompletionResponse
    {
        public List<OpenAIChoice>? Choices { get; set; }
    }

    public class OpenAIChoice
    {
        public OpenAIMessage? Message { get; set; }
        public int Index { get; set; }
        public string? FinishReason { get; set; }
    }
    public class OpenAIMessage
    {
        public string? Role { get; set; }
        public string? Content { get; set; }
    }
    public class ImageResponse
    {
        public int Created { get; set; }
        public List<ImageData> Data { get; set; }
    }

    public class ImageData
    {
        public string B64Json { get; set; }
    }
}

