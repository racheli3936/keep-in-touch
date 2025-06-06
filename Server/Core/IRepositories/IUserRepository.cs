﻿using Core.Models;
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
        Task<List<User>> GetAllUsersAsync();

        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByEmailAsync(string email);
        Task AddGroupForUserAsync(GroupUser groupForUser, int userId);
        Task AddUser(User user);
        void UpdateUser(string token, User user);
        Task UpdateUserAsync(User user);
        void DeleteUser(int id);
        Task<bool> RemoveUserFromGroupByEmailAsync(string email, int groupId);
    }
}
