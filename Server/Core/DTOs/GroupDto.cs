using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs
{
    public class GroupDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int AdminId { get; set; }
        public List<MyFile> Files { get; set; } = new List<MyFile>();
    }
}
