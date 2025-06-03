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
    public class GroupRepository : IGroupRepository
    {
        private readonly DataContext _context;

        public GroupRepository(DataContext context)
        {
            _context = context;
        }


        //public async Task<IEnumerable<Group>> GetGroupsByUserIdAsync(int userId)
        //{
        //    var user = await _context.Users
        //                              .Include(u => u.UserGroups) // טוען את הקבוצות של המשתמש
        //                              .ThenInclude(ug => ug.Group) // טוען את הקבוצות מתוך GroupUser
        //                              .FirstOrDefaultAsync(u => u.Id == userId);

        //    if (user == null)
        //    {
        //        return Enumerable.Empty<Group>(); // מחזיר אוסף ריק אם המשתמש לא נמצא
        //    }

        //    return user.UserGroups.Select(ug => ug.Group); // מחזיר את הקבוצות מתוך UserGroups
        //}
        public async Task<List<Group>> GetGroupsByIdsAsync(List<int> groupIds)//הפונקציה מקבלת רשימת אידי של קבוצות ומחזירה רשימה של אוביקטי קבוצה בהתאמה לאידיים
        {
            //לקבל את הUSER
            //include(User=>User.usergroups).thenInclude(grpoupuser=>)
            return await _context.Groups
                .Where(g => groupIds.Contains(g.Id))
                .ToListAsync();
        }

        public async Task AddUserForGroupAsync(GroupUser userForGroup, int groupId)
        {
            var group = _context.Groups.FirstOrDefault(g => g.Id == groupId);
            if (group != null)
            {
                group.GroupMembers.Add(userForGroup);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Group>> GetAllAsync()
        {
            return await _context.Groups.ToListAsync();
        }

        public async Task<IEnumerable<GroupUser>> GetAllUser_GroupsAsync()
        {
            return await _context.Groups
           .Include(g => g.GroupMembers)
           .SelectMany(g => g.GroupMembers)
           .ToListAsync();
        }
        public async Task<Group> GetByIdAsync(int id)
        {
            return await _context.Groups.Include(g => g.GroupMembers).Include(g=>g.Events).Include(g=>g.Massages).FirstAsync(g => g.Id == id);
        }

        public async Task<int> AddAsync(Group group)
        {
            await _context.Groups.AddAsync(group);
            await _context.SaveChangesAsync();

            // ה-ID מתעדכן באובייקט group
            return group.Id; // החזרת ה-ID החדש
        }
        public async Task AddFileToGroup(MyFile file)
        {
            Group group = await _context.Groups.FirstOrDefaultAsync(g => g.Id == file.GroupId);
            if (group != null)
            {
                group.Events.Add(file);
                await _context.SaveChangesAsync();
            }

        }
        public async Task UpdateAsync(Group group)
        {
            _context.Groups.Update(group);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteGroupAsync(int groupId)
        {
            Group group = await GetByIdAsync(groupId);
            
            if (group != null)
            {
                // מחק את כל הקבצים, המשתמשים וההודעות אם יש צורך
                _context.Files.RemoveRange(group.Events);
                if (group.Massages != null && group.Massages.Any())
                {
                    foreach (var message in group.Massages.ToList())
                    {
                        // מחק את ההודעה (אם יש לך שיטה למחוק הודעות)
                        _context.Entry(message).State = EntityState.Deleted;
                    }
                }
                if (group.GroupMembers != null && group.GroupMembers.Any())
                {
                    foreach (var groupUser in group.GroupMembers.ToList())
                    {
                        // מחק את ההודעה (אם יש לך שיטה למחוק הודעות)
                        _context.Entry(groupUser).State = EntityState.Deleted;
                    }
                }

                //_context.Users.RemoveRange(group.Users);

                // מחק את הקבוצה עצמה
                _context.Groups.Remove(group);
                await _context.SaveChangesAsync();
            }
        }
    }
}
