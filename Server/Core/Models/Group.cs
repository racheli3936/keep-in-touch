using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Group
    {
        [Key]
        public int Id { get; set; }
        public int AdminId { get; set; }
        public string Name { get; set; }
        public string password { get; set; }
        public List<MyFile> Events { get; set; } = new List<MyFile>();
        public List<GroupUser> GroupMembers { get; set; } = new List<GroupUser>();
        public List<Massage> Massages { get; set; } = new List<Massage>();
    }
}
