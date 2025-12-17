using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Dtos;

public class FloorService
{
    private readonly IFloorRepository _repository;

    public FloorService(IFloorRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<Floor>> GetFloorsByBuilding(int buildingId)
        => _repository.GetByBuildingIdAsync(buildingId);

    public async Task<Floor> AddFloorAsync(CreateFloorDto dto)
    {
        var floor = new Floor
        {
            BuildingId = dto.BuildingId,
            FloorNumber = dto.FloorNumber,
            Description = dto.Description,
            Width = dto.Width,
            Height = dto.Height,
            Scale = dto.Scale,
            Desks = new List<Desk>()
        };

        await _repository.AddAsync(floor);
        return floor;
    }

    public Task DeleteFloor(int id)
        => _repository.DeleteAsync(id);
}
