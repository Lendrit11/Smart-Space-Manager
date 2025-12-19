using BCrypt.Net;
using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace SmartSpaceManager.Service.Services
{
    public class UserService
    {
        private readonly ITokenService _tokenService;
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;

        public UserService(IUserRepository userRepository, ITokenService tokenService, IRoleRepository roleRepository)
        {
            _tokenService = tokenService;
            _userRepository = userRepository;
            _roleRepository = roleRepository;
        }

        public Task<IEnumerable<User>> GetUsers() => _userRepository.GetAllUsersAsync();
        public Task<User> GetUser(int id) => _userRepository.GetUserByIdAsync(id);

        public async Task UpdateUser(User user)
        {
            await _userRepository.UpdateUserAsync(user);
        }

        public async Task DeleteUser(int id)
        {
            await _userRepository.DeleteUserAsync(id);
        }

        // ================= Register =================
        public async Task<(string accessToken, string refreshToken)> RegisterAsync(
            string lastname, string number, string email, string firstName, string password)
        {
            // Kontrollo nëse user ekziston
            var existingUser = await _userRepository.GetByEmailAsync(email);
            if (existingUser != null)
                throw new Exception("User with this email already exists.");

            // Hash password
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            var newUser = new User
            {
                FirstName = firstName,
                LastName = lastname,
                PhoneNumber = number,
                Email = email,
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.UtcNow,
                UserRoles = new List<UserRole>()
            };

            // Kontrollo ose krijo rolin "User"
            var role = await _roleRepository.GetByNameAsync("User");
            if (role == null)
            {
                role = new Role { Name = "User" };
                await _roleRepository.AddRoleAsync(role);
            }

            // Lidh user me role
            newUser.UserRoles.Add(new UserRole { Role = role });

            // Shto user në DB
            await _userRepository.AddUserAsync(newUser);

            // Gjenero tokena
            var accessToken = _tokenService.GenerateAccessToken(newUser);
            var refreshToken = _tokenService.GenerateRefreshToken();

            newUser.refreshToken = refreshToken;
            newUser.refreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userRepository.UpdateUserAsync(newUser);

            return (accessToken, refreshToken);
        }


        public async Task<(string accessToken, string refreshToken)> RegisterAsyncAdmin(
    string lastname, string number, string email, string firstName, string password)
        {
            // Kontrollo nëse user ekziston
            var existingUser = await _userRepository.GetByEmailAsync(email);
            if (existingUser != null)
                throw new Exception("User with this email already exists.");

            // Hash password
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            var newUser = new User
            {
                FirstName = firstName,
                LastName = lastname,
                PhoneNumber = number,
                Email = email,
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.UtcNow,
                UserRoles = new List<UserRole>()
            };

            // Kontrollo ose krijo rolin "User"
            var role = await _roleRepository.GetByNameAsync("Admin");
            if (role == null)
            {
                role = new Role { Name = "Admin" };
                await _roleRepository.AddRoleAsync(role);
            }

            // Lidh user me role
            newUser.UserRoles.Add(new UserRole { Role = role });

            // Shto user në DB
            await _userRepository.AddUserAsync(newUser);

            // Gjenero tokena
            var accessToken = _tokenService.GenerateAccessToken(newUser);
            var refreshToken = _tokenService.GenerateRefreshToken();

            newUser.refreshToken = refreshToken;
            newUser.refreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userRepository.UpdateUserAsync(newUser);

            return (accessToken, refreshToken);
        }

        // ================= Login =================
        public async Task<(string accessToken, string refreshToken, bool isAdmin)> LoginAsync(string email, string password)
        {
            // Ngarko user së bashku me rolet
            var user = await _userRepository.GetByEmailWithRolesAsync(email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                throw new Exception("Invalid email or password.");

            // Gjenero tokena
            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // Ruaj refresh token
            user.refreshToken = refreshToken;
            user.refreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userRepository.UpdateUserAsync(user);

            // Kontrollo nëse user ka rolin Admin
            bool isAdmin = user.UserRoles.Any(ur => ur.Role.Name == "Admin");

            return (accessToken, refreshToken, isAdmin);
        }
        // ================= Log out =================
        public async Task LogoutAsync(int userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found.");

            // Fshij refresh token
            user.refreshToken = null;
            user.refreshTokenExpiryTime = null;

            await _userRepository.UpdateUserAsync(user);
        }

    }
}
