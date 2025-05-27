using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.IServices
{
    public interface IFileService
    {
        Task<IEnumerable<MyFile>> GetAllFilesAsync();
        Task<List<MyFile>> GetFilesByGroupIdAsync(int groupId);
        Task<MyFile> GetFileByIdAsync(int id);
        Task<MyFile> CreateFileAsync(MyFile filePost);

        Task<bool> UpdateFileAsync(MyFile updatedFile);
        Task<bool> UpdateFileContentAsync(int fileId, string newContent);
        Task<bool> DeleteFileAsync(int id);
    }
}
