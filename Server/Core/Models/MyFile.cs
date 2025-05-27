using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public enum ECategory
    {
        wedding,
        bar_mitzva,
        brit,
        party,
        other
    }
    public class MyFile
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int GroupId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public long FileSize { get; set; }   // The size of the file in bytes
        public ECategory Category { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        // The date the file was created
        public string Content { get; set; }
        //public DateTime ModifiedDate { get; set; } // The date the file was last modified
        public string FileType { get; set; }
    }
}
