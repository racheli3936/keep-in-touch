using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.IRepositories
{
    public interface IGroupRepository
    {
        Task AddFileToGroup(MyFile file);
        Task<List<Group>> GetGroupsByIdsAsync(List<int> groupIds);
        Task<IEnumerable<GroupUser>> GetAllUser_GroupsAsync();
        Task AddUserForGroupAsync(GroupUser userForGroup, int groupId);
        Task<IEnumerable<Group>> GetAllAsync();
        Task<Group> GetByIdAsync(int id);
        Task<int> AddAsync(Group group);
        Task UpdateAsync(Group group);
        Task DeleteGroupAsync(int groupId);
    }
}
