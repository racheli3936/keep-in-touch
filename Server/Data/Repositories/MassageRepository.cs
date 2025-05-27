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
    public class MassageRepository:IMassageRepository
    {

        private readonly DataContext _context;
        public MassageRepository(DataContext context)
        {
            _context = context;

        }
        public async Task<List<Massage>> GetMassagesByGroupId(int groupId)
        {

            // נוודא שהקבוצות וההודעות נטענות יחד
            var group = await _context.Groups
                .Include(g => g.Massages) // טוען את ההודעות שקשורות לקבוצה
                .FirstOrDefaultAsync(g => g.Id == groupId);

            return group?.Massages ?? new List<Massage>(); // מחזיר את ההודעות או רשימה ריקה אם אין

        }

        public async Task<Massage> AddMassageToGroupAsync(Massage massage)
        {
            Group group1 = _context.Groups.FirstOrDefault(g => g.Id == massage.GroupId);
            if (group1 != null)
            {
                Console.WriteLine(group1.Id + "hello");
                group1.Massages.Add(massage);
                await _context.SaveChangesAsync();
                return massage;
            }
            else
            {
                return new Massage();
            }


        }
        public async Task<bool> DeleteMassageFromGroupAsync(int groupId, int messageId)
        {
            var group = await _context.Groups.Include(g => g.Massages).FirstOrDefaultAsync(g => g.Id == groupId);
            if (group == null)
            {
                return false; // הקבוצה לא נמצאה
            }

            var massage = group.Massages.FirstOrDefault(m => m.Id == messageId);
            if (massage == null)
            {
                return false; // הודעה לא נמצאה
            }

            group.Massages.Remove(massage); // מחיקת ההודעה
            await _context.SaveChangesAsync(); // שמירה של השינויים בבסיס הנתונים
            return true; // מחיקה הצליחה
        }
    }
}
