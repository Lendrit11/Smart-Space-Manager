using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.DAL.Interfaces
{
    public interface IBuildingRepository
    {
        Task<IEnumerable<Building>> GetAllAsync();
        Task<Building> GetByIdAsync(int id);
        Task AddAsync(Building building);
        Task DeleteAsync(int id);
    }

}
