using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Dtos;
using SmartSpaceManager.Service.Interface;

namespace SmartSpaceManager.API.Controllers.module_desk
{
    [ApiController]
    [Authorize]
    [Route("api/seat")]
    public class SeatController : ControllerBase
    {
        private readonly ISeatService _service;

        public SeatController(ISeatService service)
        {
            _service = service;
        }

        [HttpGet("by-desk/{deskId}")]
        public async Task<IActionResult> GetByDesk(int deskId)
        {
            var seats = await _service.GetSeatsByDesk(deskId);
            return Ok(seats);
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(SeatsDto seatDto)
        {
            await _service.AddSeat(seatDto);
            return Ok();
        }

        [HttpPut("update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(SeatsDto seatDto)
        {
            await _service.UpdateSeat(seatDto);
            return Ok();
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteSeat(id);
            return Ok();
        }
    }

}
