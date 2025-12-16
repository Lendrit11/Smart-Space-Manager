using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.Service.Services
{
    public class BuildingService
    {
        private readonly IBuildingRepository _repository;

        public BuildingService(IBuildingRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<Building>> GetBuildings()
            => _repository.GetAllAsync();

        public Task<Building> GetBuilding(int id)
            => _repository.GetByIdAsync(id);

        public Task AddBuilding(Building building)
            => _repository.AddAsync(building);

        public Task DeleteBuilding(int id)
            => _repository.DeleteAsync(id);
    }
}
