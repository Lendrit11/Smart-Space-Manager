using Microsoft.EntityFrameworkCore;
using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Domain.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.DAL.Implementations
{
    public class RoleRepository : IRoleRepository
    {
        private readonly AppDbContext _context;
        public RoleRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Role>> GetRolesAsync()
        {
            return _context.Roles.ToList();
        }
        public async Task<Role> GetRoleAsync(int id)
        {
            return await _context.Roles.FindAsync(id);
        }
        public async Task<Role> GetByNameAsync(string name)
        {
            return await _context.Roles.FirstOrDefaultAsync(r => r.Name == name);
        }
        public async Task AddRoleAsync(Role role)
        {
            if (role == null)
            {
                throw new ArgumentNullException(nameof(role));
            }
            var name = await _context.Roles.FirstOrDefaultAsync(r => r.Name == role.Name);
             if (name != null)
            {
              throw new ArgumentException("Role with the same name already exists.");
            }
            await _context.Roles.AddAsync(role);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateRoleAsync(Role role)
        {
            if (role == null)
            {
                throw new ArgumentNullException(nameof(role));
            }
            _context.Roles.Update(role);
            await _context.SaveChangesAsync();
        }
        public async Task<String> DeleteRoleAsync(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role==null)
            {
                throw new Exception("Role not found");
            }
   
            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
            return "role deleted with succes";
        }

        public Task<Role> GetRoleByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        Task IRoleRepository.DeleteRoleAsync(int id)
        {
            return DeleteRoleAsync(id);
        }
    }
}
