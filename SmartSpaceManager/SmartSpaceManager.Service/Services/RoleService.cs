using SmartSpaceManager.Domain.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartSpaceManager.DAL.Interfaces;

namespace SmartSpaceManager.Service.Services
{
    public class RoleService
    {
        private readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }
        public Task<IEnumerable<Role>> GetRoles()
        {
            return _roleRepository.GetRolesAsync();
        }
        public Task<Role> GetRole(int id) => _roleRepository.GetRoleByIdAsync(id);
        public Task AddRole(Role role) => _roleRepository.AddRoleAsync(role);

        public Task DeleteRole(int id) => _roleRepository.DeleteRoleAsync(id);
    }
}
