using Azure.Core;
using BCrypt.Net;
using SmartSpaceManager.DAL.Implementations;
using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.Service.Services
{
    public class UserService
    {
        private readonly ITokenService _tokenService;
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        public UserService(IUserRepository userRepository , ITokenService tokenService, IRoleRepository roleRepository)
        {
            _tokenService = tokenService;
            _userRepository = userRepository;
            _roleRepository = roleRepository;
        }
        public Task<IEnumerable<User>> GetUsers() => _userRepository.GetAllUsersAsync();
          
        public Task<User> GetUser(int id)=> _userRepository.GetUserByIdAsync(id);
        public async Task UpdateUser(User user)
        {
            await _userRepository.UpdateUserAsync(user);
        }
        public async Task DeleteUser(int id)
        {
            await _userRepository.DeleteUserAsync(id);
        }

        public async Task<(string accessToken, string refreshToken)> RegisterAsync(
           string lastname, string number, string email, string firstName, string password)
        {
            var existingUser = await _userRepository.GetByEmailAsync(email);
            if (existingUser != null)
                throw new Exception("User with this email already exists.");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            var newUser = new User
            {
                FirstName = firstName,
                LastName = lastname,
                PhoneNumber = number,
                Email = email,
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.UtcNow
            };

            // 1️⃣ Kontrollo nëse ekziston roli "User"
            var role = await _roleRepository.GetByNameAsync("User");
            if (role == null)
            {
                role = new Role { Name = "User" };
                await _roleRepository.AddRoleAsync(role);
            }

            // 2️⃣ Lidh user me role
            newUser.UserRoles.Add(new UserRole { Role = role });

            // 3️⃣ Shto user në DB
            await _userRepository.AddUserAsync(newUser);

            // 4️⃣ Gjenero tokena
            var accessToken = _tokenService.GenerateAccessToken(newUser);
            var refreshToken = _tokenService.GenerateRefreshToken();

            newUser.refreshToken = refreshToken;
            newUser.refreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userRepository.UpdateUserAsync(newUser);

            return (accessToken, refreshToken);
        }

        public async Task<(string accessToken, string refreshToken, bool isAdmin)> LoginAsync(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                throw new Exception("Invalid email or password.");

            // Gjenero token
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
    }
}
