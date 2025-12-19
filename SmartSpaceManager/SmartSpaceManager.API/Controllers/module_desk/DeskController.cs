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
    [Route("api/desk")]
    public class DeskController : ControllerBase
    {
        private readonly IDeskService _service;
        private readonly ActivityLogService _activityLogService;

        public DeskController(IDeskService service, ActivityLogService activityLogService)
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


 
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(DeskDto deskDto)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"Created Desk = {deskDto.Id} from admin {userId}");
            await _service.AddDesk(deskDto);
            return Ok();
        }

        [HttpPut("update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(DeskDto deskDto)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"updated Desk{deskDto.Id} from admin {userId}");
            await _service.UpdateDesk(deskDto);
            return Ok();
        }

        [HttpGet("by-floor/{floorId}")]
        [Authorize]
        public async Task<IActionResult> GetByFloorid(int floorId)
        {
            var desks = await _service.GetDesksByFloor(floorId);

            var deskDtos = desks.Select(d => new DeskDto
            {
                Id = d.Id,
                Name = d.Name,
                PositionX = d.PositionX,
                PositionY = d.PositionY,
                Width = d.Width,
                Height = d.Height,
                Shape = d.Shape,
                FloorId = d.FloorId,
                Seats = d.Seats?.Select(s => new SeatDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    PositionX = s.PositionX,
                    PositionY = s.PositionY,
                    ReservationId = s.reservationId
                }).ToList() ?? new List<SeatDto>()
            });

            return Ok(deskDtos);
        }


        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"deleted Desk = {id} from admin {userId}");
            await _service.DeleteDesk(id);
            return Ok();
        }
    }
}
