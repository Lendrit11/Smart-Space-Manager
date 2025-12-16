using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Dtos;
using SmartSpaceManager.Service.Interface;

namespace SmartSpaceManager.API.Controllers.module_desk
{
    [ApiController]
    [Authorize]
    [Route("api/desk")]
    public class DeskController : ControllerBase
    {
        private readonly IDeskService _service;

        public DeskController(IDeskService service)
        {
            _service = service;
        }

        [HttpGet("by-floor/{floorId}")]
        public async Task<IActionResult> GetByFloor(int floorId)
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

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(DeskDto deskDto)
        {
            await _service.AddDesk(deskDto);
            return Ok();
        }

        [HttpPut("update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(DeskDto deskDto)
        {
            await _service.UpdateDesk(deskDto);
            return Ok();
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteDesk(id);
            return Ok();
        }
    }
}
