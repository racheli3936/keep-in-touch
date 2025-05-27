using Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Threading.Tasks;

namespace Data
{
    public class DataContext:DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<MyFile> Files { get; set; }
        public DbSet<Group> Groups { get; set; }

        // public DbSet<GroupUser> GroupsUsers { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Database=KeepInTouch");
        //}
        //public DataContext()
        //{
        //    Users = new DbSet<User>();
        //    Files = new DbSet<MyFile>();
        //}
    }
}
