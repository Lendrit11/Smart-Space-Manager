using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Dtos;

namespace SmartSpaceManager.Service.Services
{
    public class BuildingService
    {
        private readonly IBuildingRepository _repository;

        public BuildingService(IBuildingRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<BuildingDto>> GetBuildings()
        {
            var buildings = await _repository.GetAllAsync();

            // Map-o secilin Building në DTO
            return buildings.Select(b => new BuildingDto
            {
                Id = b.Id,
                Name = b.Name
            });
        }

        public Task<Building> GetBuilding(int id)
            => _repository.GetByIdAsync(id);

        public Task AddBuilding(Building building)
            => _repository.AddAsync(building);

        public Task DeleteBuilding(int id)
            => _repository.DeleteAsync(id);
    }
}
