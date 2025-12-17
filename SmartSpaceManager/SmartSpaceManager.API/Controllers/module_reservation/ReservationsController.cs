using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Dtos;
using SmartSpaceManager.Service.Services;
using System.Security.Claims;

namespace SmartSpaceManager.API.Controllers.module_reservation
{

    [ApiController]
    [Route("api/reservations")]
    public class ReservationsController : ControllerBase
    {
        private readonly ReservationService _reservationService;
        private readonly ActivityLogService _activityLogService;

        public ReservationsController(ReservationService reservationService, ActivityLogService activityLogService)
        {
            _reservationService = reservationService;
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

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateReservationDto dto)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"Created reservations from user = {userId}");
            var id = await _reservationService.CreateReservationAsync(dto, userId);
            return Ok(new { ReservationId = id });
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
            var res = await _reservationService.GetReservationByIdAsync(id);
            return Ok(res);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Cancel(int id)
        {
            var userId = GetUserIdFromToken();
            await _activityLogService.LogAsync(userId, $"Deleted reservations = {id} from user = {userId}");
            await _reservationService.CancelReservationAsync(id);
            return Ok("Reservation cancelled.");
        }
        [HttpGet("get-all")]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var reservations = await _reservationService.GetAllReservationsAsync();
                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

    }
}
