using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.IRepositories
{
    public interface IFileRepository
    {
        Task<MyFile> GetFileByIdAsync(int id);
        Task<IEnumerable<MyFile>> GetAllFilesAsync();
        Task<List<MyFile>> GetFilesByGroupIdAsync(int groupId);
        Task<MyFile> AddFileAsync(MyFile newfile);
        Task<bool> UpdateFileAsync(MyFile updatedfile);
        Task<bool> UpdateFileContentAsync(int fileId, string newContent);
        Task<bool> DeleteFileAsync(int id);
      
       
    }
}
