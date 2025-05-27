using Core.Models;

namespace Api.PostModels
{
    public class FilePost
    {
        public int GroupId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public long FileSize { get; set; }
        public ECategory Category { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public string FileType { get; set; }
        public DateTime EventDate { get; set; }
    }
}
