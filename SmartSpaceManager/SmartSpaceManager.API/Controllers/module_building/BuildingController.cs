using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Services;
using System.Security.Claims;
namespace SmartSpaceManager.API.Controllers.module_building
{
    [ApiController]
    [Route("api/building")]
    [Authorize]
    public class BuildingController : ControllerBase
    {
        private readonly BuildingService _service;
        private readonly ActivityLogService _activityLogService;
        public BuildingController(BuildingService service , ActivityLogService activityLogService )
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

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetBuildings());

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(Building building)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"Created Building {building.Id} from admin {userId}");
            await _service.AddBuilding(building);
            return Ok();
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"deleted Building {id} from admin {userId}");
            await _service.DeleteBuilding(id);
            return Ok();
        }
    }

}
