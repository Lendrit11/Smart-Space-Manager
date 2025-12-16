using SmartSpaceManager.Domain.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.DAL.Interfaces
{
    public interface IRoleRepository
    {
        Task<IEnumerable<Role>> GetRolesAsync();
        Task<Role> GetRoleByIdAsync(int id);
        Task AddRoleAsync(Role role);
        Task DeleteRoleAsync(int id);
        Task<Role> GetByNameAsync(string name);

    }
}
