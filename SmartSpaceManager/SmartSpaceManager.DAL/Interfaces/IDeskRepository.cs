using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.DAL.Interfaces
{
    public interface IDeskRepository
    {
        Task<IEnumerable<Desk>> GetDesksByFloorAsync(int floorId);
        Task<Desk> GetDeskByIdAsync(int id);
        Task AddDeskAsync(Desk desk);
        Task UpdateDeskAsync(Desk desk);
        Task DeleteDeskAsync(int id);
    }
}
