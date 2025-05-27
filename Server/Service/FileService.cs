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
    public class FileService:IFileService
    {
        private readonly IFileRepository _fileRepository;
        private readonly IGroupRepository _groupRepository;
        public FileService(IFileRepository fileRepository, IGroupRepository groupRepository)
        {
            _fileRepository = fileRepository;
            _groupRepository = groupRepository;
        }
        public async Task<IEnumerable<MyFile>> GetAllFilesAsync()
        {
            return await _fileRepository.GetAllFilesAsync();
        }

        public async Task<List<MyFile>> GetFilesByGroupIdAsync(int groupId)
        {
            return await _fileRepository.GetFilesByGroupIdAsync(groupId);
        }
        public async Task<MyFile> GetFileByIdAsync(int id)
        {
            return await _fileRepository.GetFileByIdAsync(id);
        }
        public async Task<MyFile> CreateFileAsync(MyFile file)
        {
            MyFile myFile = await _fileRepository.AddFileAsync(file);
            Console.WriteLine(myFile.Id);
            await _groupRepository.AddFileToGroup(file);
            return file;
        }
        public async Task<bool> UpdateFileAsync(MyFile updatedFile)
        {
            return await _fileRepository.UpdateFileAsync(updatedFile);
        }
        public async Task<bool> UpdateFileContentAsync(int fileId, string newContent)
        {
            return await _fileRepository.UpdateFileContentAsync(fileId, newContent);
        }
        public async Task<bool> DeleteFileAsync(int id)
        {
            return await _fileRepository.DeleteFileAsync(id);
        }

    }
}
