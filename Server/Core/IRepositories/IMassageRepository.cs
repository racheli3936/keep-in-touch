using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.IRepositories
{
    public interface IMassageRepository
    {
        Task<List<Massage>> GetMassagesByGroupId(int groupId);

        Task<Massage> AddMassageToGroupAsync(Massage massage);
        Task<bool> DeleteMassageFromGroupAsync(int groupId, int messageId);
    }
}
