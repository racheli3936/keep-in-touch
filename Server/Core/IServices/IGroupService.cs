using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.IServices
{
    public interface IGroupService
    {
        Task<IEnumerable<Group>> GetGroupsByUserIdAsync(int userId);
        Task<IEnumerable<GroupUser>> GetAllUser_GroupsAsync();
        Task<IEnumerable<Group>> GetAllGroupsAsync();
        Task<Group> GetGroupByIdAsync(int id);
        Task AddGroupAsync(Group group);
        Task AddUserToGroupAsync(int groupId, int userId);
        Task UpdateGroupAsync(Group group);
        Task DeleteGroupAsync(int groupId);
    }
}
