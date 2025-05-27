using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.IServices
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetUsersByGroupIdAsync(int groupId);
        List<User> GetUsersList();
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByEmailAsync(string email);
        void AddUser(User user);
        void UpdateUser(string token, User user);
        Task<User> UpdateUserAsync(int id, User userUpdate);
        Task<bool> RemoveUserFromGroupByEmailAsync(string email, int groupId);
        void DeleteUser(int id);
    }
}
