using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.DAL.Implementations
{
    public class BuildingRepository : IBuildingRepository
    {
        private readonly AppDbContext _context;

        public BuildingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Building>> GetAllAsync()
        {
            return await _context.Buildings
                .Include(b => b.Floors)
                .ToListAsync();
        }

        public async Task<Building> GetByIdAsync(int id)
        {
            return await _context.Buildings
                .Include(b => b.Floors)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task AddAsync(Building building)
        {
            await _context.Buildings.AddAsync(building);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var building = await _context.Buildings.FindAsync(id);
            if (building != null)
            {
                _context.Buildings.Remove(building);
                await _context.SaveChangesAsync();
            }
        }
    }

}
