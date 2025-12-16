using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.Service.Interface
{
    public interface IBuildingService
    {
        Task<IEnumerable<Building>> GetBuildings();
        Task<Building> GetBuilding(int id);
        Task AddBuilding(Building building);
        Task DeleteBuilding(int id);
    }
}
