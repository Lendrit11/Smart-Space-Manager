using Microsoft.AspNetCore.Mvc;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Services;
using Microsoft.AspNetCore.Authorization;
namespace SmartSpaceManager.API.Controllers.module_building
{
    [ApiController]
    [Route("api/building")]
    [Authorize]
    public class BuildingController : ControllerBase
    {
        private readonly BuildingService _service;
        public BuildingController(BuildingService service) => _service = service;

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetBuildings());

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(Building building)
        {
            await _service.AddBuilding(building);
            return Ok();
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteBuilding(id);
            return Ok();
        }
    }

}
