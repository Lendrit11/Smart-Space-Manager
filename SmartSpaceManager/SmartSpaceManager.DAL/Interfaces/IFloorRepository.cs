using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.DAL.Interfaces
{
    public interface IFloorRepository
    {
        Task<IEnumerable<Floor>> GetByBuildingIdAsync(int buildingId);
        Task<Floor> GetByIdAsync(int id);
        Task AddAsync(Floor floor);
        Task DeleteAsync(int id);
    }
}
