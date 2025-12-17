using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Services;
using System.Data;
using System.Security.Claims;
using System.Threading.Tasks;
namespace SmartSpaceManager.API.Controllers.module_user
{
    [ApiController]
    [Route("api/role")]
    public class RoleController : ControllerBase
    {
        private readonly RoleService _service;
        private readonly ActivityLogService _activityLogService;
        public RoleController(RoleService service, ActivityLogService activityLogService)
        {
            _service = service;
            _activityLogService = activityLogService;
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
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetRoles());
        }
        [HttpPost("createRole")]
        [Authorize]
        public async Task<IActionResult> CreateRole(Role role)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"Created role with Id {role.Id}");

            await _service.AddRole(role);
            return Ok();
        }

        [HttpDelete("deleteRole/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"Deleted role with Id {id}");
            await _service.DeleteRole(id);
            return Ok();
        }   
    }
}
