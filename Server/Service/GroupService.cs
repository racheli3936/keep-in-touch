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
    public class GroupService:IGroupService
    {

        private readonly IGroupRepository _groupRepository;
        private readonly IUserRepository _userRepository;
        private readonly IFileRepository _fileRepository;
        public GroupService(IGroupRepository GroupRepository, IUserRepository userRepository,IFileRepository fileRepository)
        {
            _groupRepository = GroupRepository;
            _userRepository = userRepository;
            _fileRepository = fileRepository;
        }
        public async Task<IEnumerable<Group>> GetGroupsByUserIdAsync(int userId)
        {
            User user = await _userRepository.GetUserByIdAsync(userId);
            Console.WriteLine(user.Name + "= userName");
            if (user == null)
            {
                Console.WriteLine("user is null");
                return Enumerable.Empty<Group>();
            }
            Console.WriteLine(user.UserGroups + "user group new");
            List<GroupUser> userGroups = user.UserGroups;
            Console.WriteLine(userGroups.Count + " count");
            List<Group> groups = await _groupRepository.GetGroupsByIdsAsync(userGroups.Select(ug => ug.GroupId).ToList());
            return groups;
        }
        public async Task<IEnumerable<Group>> GetAllGroupsAsync()
        {
            return await _groupRepository.GetAllAsync();
        }
        public async Task<IEnumerable<GroupUser>> GetAllUser_GroupsAsync()
        {
            return await _groupRepository.GetAllUser_GroupsAsync();
        }
        public async Task<Group> GetGroupByIdAsync(int id)
        {
            return await _groupRepository.GetByIdAsync(id);
        }
        public async Task AddGroupAsync(Group group)
        {  // חפש את המשתמש האדמין לפי AdminId
            var admin = await _userRepository.GetUserByIdAsync(group.AdminId);
            if (admin == null)
            {
                throw new Exception("Admin user not found");
            }
            // הוסף את המשתמש לרשימת חברי הקבוצה
            //הוספת הקבוצה לרשימת הקבוצותV
            //הוספת חבר לקבוצהV
            //הוספת קבוצה לחברV
            //הוספת חבר-קבוצה לרשימת חברים-קבוצות
            int groupId = await _groupRepository.AddAsync(group);
            await Console.Out.WriteLineAsync("groupId" + groupId);
            var groupUser = new GroupUser
            {
                UserId = admin.Id,
                GroupId = groupId,
                Role = EUserRole.Admin
            };
            await _userRepository.AddGroupForUserAsync(groupUser, admin.Id);
            await _groupRepository.AddUserForGroupAsync(groupUser, groupId);
        }
        public async Task AddUserToGroupAsync(int groupId, int userId)
        {
            User user = await _userRepository.GetUserByIdAsync(userId);
            //הוספת המשתמש לקבוצה
            //הוספת הקבוצה למשתמש
            var groupUser = new GroupUser
            {
                UserId = userId,
                GroupId = groupId,
                Role = EUserRole.User
            };
            await _groupRepository.AddUserForGroupAsync(groupUser, groupId);
            await _userRepository.AddGroupForUserAsync(groupUser, userId);
        }
        public async Task UpdateGroupAsync(Group group)
        {
            await _groupRepository.UpdateAsync(group);
        }
        //למחוק את כל הקבצים של הקבוצה
        //למחוק את ההודעות
        //למחוק את המשתמשים מהקבוצה
        //למחוק את הקבוצה בעצמה
        public async Task DeleteGroupAsync(int groupId)
        {
            //Group group =await _groupRepository.GetByIdAsync(groupId);
            
            await _groupRepository.DeleteGroupAsync(groupId);
        }
    }
}
