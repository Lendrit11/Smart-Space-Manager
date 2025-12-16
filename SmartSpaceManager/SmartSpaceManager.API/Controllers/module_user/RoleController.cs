using Microsoft.AspNetCore.Mvc;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Services;
using System.Threading.Tasks;
namespace SmartSpaceManager.API.Controllers.module_user
{
    [ApiController]
    [Route("api/role")]
    public class RoleController : ControllerBase
    {
        private readonly RoleService _service;
        public RoleController(RoleService service)
        {
            _service = service;
        }
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetRoles());
        }
        [HttpPost("createRole")]
        public async Task<IActionResult> CreateRole(Role role)
        {
            await _service.AddRole(role);
            return Ok();
        }
        [HttpDelete("deleteRole/{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            await _service.DeleteRole(id);
            return Ok();
        }   
    }
}
