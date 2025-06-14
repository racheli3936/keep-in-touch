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
    public class FileRepository:IFileRepository
    {
        private readonly DataContext _context;

        public FileRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MyFile>> GetAllFilesAsync()
        {
            return await _context.Files.ToListAsync();
        }
        public async Task<List<MyFile>> GetFilesByGroupIdAsync(int groupId)
        {
            return await _context.Files
                .Where(file => file.GroupId == groupId)
                .ToListAsync();
        }
        public async Task<MyFile> GetFileByIdAsync(int id)
        {
            return await _context.Files.FindAsync(id);
        }

        public async Task<MyFile> AddFileAsync(MyFile newFile)
        {
            _context.Files.Add(newFile);
            await _context.SaveChangesAsync();
            return newFile;
        }

        public async Task<bool> UpdateFileAsync(MyFile updatedFile)
        {
            _context.Entry(updatedFile).State = EntityState.Modified;
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
        public async Task<bool> UpdateFileContentAsync(int fileId, string newContent)
        {
            var file = await _context.Files.FindAsync(fileId);
            if (file == null)
            {
                return false;
            }

            file.Content = newContent;
            await _context.SaveChangesAsync();
            return true;
        }

       
        public async Task<bool> DeleteFileAsync(int id)
        {
            var file = await _context.Files.FindAsync(id);
            if (file == null)
            {
                return false;
            }

            _context.Files.Remove(file);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}
