using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.Service.Interface
{
    public interface IFloorService
    {
        Task<IEnumerable<Floor>> GetFloorsByBuilding(int buildingId);
        Task AddFloor(Floor floor);
        Task DeleteFloor(int id);
    }
}
