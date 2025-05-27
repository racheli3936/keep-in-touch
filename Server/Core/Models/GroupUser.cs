using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class GroupUser
    {

        [Key]
        public int Id { get; set; }
        [ForeignKey("Group")]
        public int GroupId { get; set; }
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public EUserRole Role { get; set; }
        // public Group Group { get; set; }
        // public User User { get; set; }
    }
}
