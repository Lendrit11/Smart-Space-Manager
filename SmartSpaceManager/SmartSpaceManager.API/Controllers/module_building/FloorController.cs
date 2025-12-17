using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Dtos;
using SmartSpaceManager.Service.Services;
using System.Security.Claims;
namespace SmartSpaceManager.API.Controllers.module_building
{
    [ApiController]
    [Route("api/floor")]
    [Authorize]
    public class FloorController : ControllerBase
    {
        private readonly FloorService _service;
        private readonly ActivityLogService _activityLogService;
        public FloorController(FloorService service, ActivityLogService activityLogService)
        {
            _activityLogService = activityLogService;
            _service = service;
        }

        private int GetUserIdFromToken()
        {
            // Marrim Claim-in "sub" ose "id" nga tokeni
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new Exception("UserId not found in token.");

            return int.Parse(userIdClaim.Value);
        }

        [HttpGet("by-building/{buildingId}")]
        public async Task<IActionResult> GetByBuilding(int buildingId)
            => Ok(await _service.GetFloorsByBuilding(buildingId));

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateFloorDto dto)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"Created floor in Building {dto.BuildingId} with Id {userId}");
            var floor = await _service.AddFloorAsync(dto);
            return Ok(floor);
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"deleted floor {id} from user = {userId}");
            await _service.DeleteFloor(id);
            return Ok();
        }
    }

}
