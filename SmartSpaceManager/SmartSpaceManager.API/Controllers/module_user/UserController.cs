using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Services;
using System.Security.Claims;

namespace SmartSpaceManager.API.Controllers.module_user
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
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
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetUsers();
            return Ok(users);
        }

        [HttpGet("get/{id}")]
        [Authorize]
        public async Task<IActionResult> getUser(int id) {
            var user = await _userService.GetUser(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(string FirstName, string lastName, string email, string phonenumber, string password)
        {
            var (accessToken, refreshToken) = await _userService.RegisterAsync(FirstName, lastName, email, phonenumber, password);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { accessToken });
        }
        [HttpPost("register_admin")]
        public async Task<IActionResult> RegisterAdmin(string FirstName, string lastName, string email, string phonenumber, string password)
        {
            var (accessToken, refreshToken) = await _userService.RegisterAsyncAdmin(FirstName, lastName, email, phonenumber, password);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { accessToken });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var (accessToken, refreshToken, isAdmin) = await _userService.LoginAsync(email, password);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { accessToken });
        }

        [HttpDelete("deleteUser/{id}")]
        [Authorize]
        public async Task<IActionResult> deleteUser(int id)
        {
            await _userService.DeleteUser(id);
            return Ok();
        }

    }

}
