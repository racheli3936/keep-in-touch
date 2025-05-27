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
    public class UserRepository:IUserRepository
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public List<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }
        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.UserGroups) // הנחה שיש לך קשר בין Users ל-GroupUsers
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<User>> GetUsersByGroupIdAsync(int groupId)
        {
            return await (from gu in _context.Set<GroupUser>()
                          join u in _context.Set<User>() on gu.UserId equals u.Id
                          where gu.GroupId == groupId
                          select u).ToListAsync();
        }
        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
        public void AddUser(User user)
        {
            _context.Users.Add(user);
        }
        public void UpdateUser(string token, User newUser)
        {
            // Parse the TOKEN to get the user ID
            //var userIdString = GetUserIdFromToken(token);

            //// Convert the userId from string to int
            //if (int.TryParse(userIdString, out int userId))
            //{
            //    var existingUser = GetUserById(userId);
            //    if (existingUser != null)
            //    {
            //        existingUser.Name = newUser.Name; // Assuming User has a Name property
            //        existingUser.Email = newUser.Email; // Assuming User has an Email property
            //                                            // Update other properties as needed
            //    }
            //}
            //else
            //{
            //    // Handle the case where the userId is not a valid integer
            //    throw new ArgumentException("Invalid user ID.");
            //}
        }
        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user); // Assuming _context is your DbContext
            await _context.SaveChangesAsync(); // Save changes to the database
        }
        public async Task AddGroupForUserAsync(GroupUser groupForUser, int userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user != null)
            {
                _context.Users.FirstOrDefault(u => u.Id == userId).UserGroups.Add(groupForUser);
                Console.WriteLine(user.UserGroups.Count + "bfore save");
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error saving changes: {ex.Message}");
                }
            }
        }

        public async void DeleteUser(int id)
        {
            var userToRemove = await GetUserByIdAsync(id);
            if (userToRemove != null)
            {
                _context.Users.Remove(userToRemove);
            }
        }
        public async Task<bool> RemoveUserFromGroupByEmailAsync(string email, int groupId)
        {
            // Find the user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return false; // User not found

            // Find the group by ID
            var group = await _context.Groups.Include(g => g.GroupMembers)
                                              .FirstOrDefaultAsync(g => g.Id == groupId);
            if (group == null) return false; // Group not found

            // Find the GroupUser entry in the GroupMembers list
            var groupUser = group.GroupMembers.FirstOrDefault(gu => gu.UserId == user.Id);
            if (groupUser == null) return false; // User is not a member of the group

            group.GroupMembers.Remove(groupUser); // Remove the entry
            await _context.SaveChangesAsync(); // Save changes to the database
            return true; // Successfully removed
        }
    }
}
