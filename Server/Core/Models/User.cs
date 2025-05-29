using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public enum EUserRole
    {
        System_administrator,
        Admin,
        User
    }
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        // public EUserRole Role {  get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string PreviousFamily { get; set; }
        public string PasswordHash { get; set; }

        // public List<Group> Groups { get; set; }
        public List<GroupUser> UserGroups { get; set; } = new List<GroupUser>();
    }
}
