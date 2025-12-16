using Microsoft.AspNetCore.Mvc;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Services;
using Microsoft.AspNetCore.Authorization;
namespace SmartSpaceManager.API.Controllers.module_building
{
    [ApiController]
    [Route("api/floor")]
    [Authorize]
    public class FloorController : ControllerBase
    {
        private readonly FloorService _service;
        public FloorController(FloorService service) => _service = service;

        [HttpGet("by-building/{buildingId}")]
        public async Task<IActionResult> GetByBuilding(int buildingId)
            => Ok(await _service.GetFloorsByBuilding(buildingId));

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(Floor floor)
        {
            await _service.AddFloor(floor);
            return Ok();
        }
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteFloor(id);
            return Ok();
        }

    }

}
