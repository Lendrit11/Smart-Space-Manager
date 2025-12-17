using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Dtos;
using SmartSpaceManager.Service.Interface;
using SmartSpaceManager.Service.Services;
using System.Security.Claims;

namespace SmartSpaceManager.API.Controllers.module_desk
{
    [ApiController]
    [Authorize]
    [Route("api/seat")]
    public class SeatController : ControllerBase
    {
        private readonly ISeatService _service;
        private readonly ActivityLogService _activityLogService;

        public SeatController(ISeatService service,ActivityLogService activityLogService)
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

        [HttpGet("by-desk/{deskId}")]
        [Authorize]
        public async Task<IActionResult> GetByDesk(int deskId)
        {
            var seats = await _service.GetSeatsByDesk(deskId);
            return Ok(seats);
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(SeatsDto seatDto)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"Created seat {seatDto.Id} from admin {userId}");
            await _service.AddSeat(seatDto);
            return Ok();
        }

        [HttpPut("update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(SeatsDto seatDto)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"updated seat {seatDto.Id} from admin {userId}");
            await _service.UpdateSeat(seatDto);
            return Ok();
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"deleted Seat = {id} from admin = {userId}");
            await _service.DeleteSeat(id);
            return Ok();
        }
    }

}
