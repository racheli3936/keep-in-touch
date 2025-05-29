using Core.IRepositories;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repositories
{
    public class AuthRepository:IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> IsUserAdminastator(User user)
        {
           User user1= await _context.Users.Include(u => u.UserGroups).FirstOrDefaultAsync(
                u => u.Email == user.Email && u.UserGroups.Any(ug => ug.Role == EUserRole.System_administrator));
            if (user1 == null) {
                return false;
            }
            return true;
        }
        public async Task<User> GetUserByEmailAndPasswordAsync(string email, string password)
        {
            bool isPasswordValid = false;
            User user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
            if (user != null)
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            }
            if (isPasswordValid)
                return user;
            return null;
        }
        public async Task<User> CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}
