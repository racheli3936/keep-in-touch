using Core.IRepositories;
using Core.IServices;
using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class UserService:IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IGroupRepository _groupRepository;
        public UserService(IUserRepository userRepository, IGroupRepository groupRepository)
        {
            _userRepository = userRepository;
            _groupRepository = groupRepository;
        }
        public async Task<IEnumerable<User>> GetUsersByGroupIdAsync(int groupId)
        {
            //Group groupUsers=await _groupRepository.GetByIdAsync(groupId);
            //List<int> usersIds=groupUsers.
            return await _userRepository.GetUsersByGroupIdAsync(groupId);
        }
        public List<User> GetUsersList()
        {
            return _userRepository.GetAllUsers();
        }
        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetUserByIdAsync(id);
        }
        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetUserByEmailAsync(email);
        }
        public async Task AddUserToGroupAsync(int groupId, int userId, EUserRole role)
        {
            // הוסף את המשתמש לקבוצה
            var groupUser = new GroupUser
            {
                GroupId = groupId,
                UserId = userId,
                Role = role
            };

            // הוסף את המשתמש לרשימה של הקבוצה
            //group.GroupMembers.Add(groupUser);
            //// הוסף את הקבוצה לרשימה של המשתמש
            //user.UserGroups.Add(groupUser);

            //// שמור את השינויים בבסיס הנתונים
            //await _context.SaveChangesAsync();
        }
        public void AddUser(User user)
        {
            _userRepository.AddUser(user);
        }

        public void UpdateUser(string token, User user)
        {
            _userRepository.UpdateUser(token, user);
        }
        public async Task<User> UpdateUserAsync(int id, User userUpdate)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(id);
            if (existingUser == null)
            {
                return null; // Indicate that the user was not found
            }
            if (userUpdate.PasswordHash == "")
            {
                userUpdate.PasswordHash = existingUser.PasswordHash;
            }
            // Map updated fields
            existingUser.Name = userUpdate.Name;
            existingUser.Phone = userUpdate.Phone;
            existingUser.Email = userUpdate.Email;
            existingUser.Address = userUpdate.Address;
            existingUser.PasswordHash = userUpdate.PasswordHash;
            existingUser.PreviousFamily = userUpdate.PreviousFamily;

            await _userRepository.UpdateUserAsync(existingUser);
            return existingUser; // Optionally return the updated user
        }

        public void DeleteUser(int id)
        {
            _userRepository.DeleteUser(id);
        }
        public async Task<bool> RemoveUserFromGroupByEmailAsync(string email, int groupId)
        {
            return await _userRepository.RemoveUserFromGroupByEmailAsync(email, groupId);
        }
    }
}
