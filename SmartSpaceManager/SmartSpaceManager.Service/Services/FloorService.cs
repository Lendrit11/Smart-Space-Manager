using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.Service.Services
{
    public class FloorService
    {
        private readonly IFloorRepository _repository;

        public FloorService(IFloorRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<Floor>> GetFloorsByBuilding(int buildingId)
            => _repository.GetByBuildingIdAsync(buildingId);

        public Task AddFloor(Floor floor)
            => _repository.AddAsync(floor);

        public Task DeleteFloor(int id)
            => _repository.DeleteAsync(id);
    }
}
