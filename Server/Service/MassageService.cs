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
    public class MassageService:IMassageService
    {
        private readonly IMassageRepository _massageRepository;
        public MassageService(IMassageRepository massageRepository)
        {
            _massageRepository = massageRepository;
        }
        public async Task<List<Massage>> GetMassagesByGroupId(int groupId)
        {
            return await _massageRepository.GetMassagesByGroupId(groupId); // קורא לפונקציה ב-repository
        }
        public async Task<Massage> AddMassageToGroupAsync(Massage massage)
        {
            Massage massage1 = await _massageRepository.AddMassageToGroupAsync(massage);
            return massage1;
        }
        public async Task<bool> DeleteMassageFromGroupAsync(int groupId, int messageId)
        {
            return await _massageRepository.DeleteMassageFromGroupAsync(groupId, messageId);
        }
    }
}
