using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.IRepositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetUsersByGroupIdAsync(int groupId);
        List<User> GetAllUsers();

        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByEmailAsync(string email);
        Task AddGroupForUserAsync(GroupUser groupForUser, int userId);
        void AddUser(User user);
        void UpdateUser(string token, User user);
        Task UpdateUserAsync(User user);
        void DeleteUser(int id);
        Task<bool> RemoveUserFromGroupByEmailAsync(string email, int groupId);
    }
}
