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
    public class FloorRepository : IFloorRepository
    {
        private readonly AppDbContext _context;

        public FloorRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Floor>> GetByBuildingIdAsync(int buildingId)
        {
            return await _context.Floors
                .Where(f => f.BuildingId == buildingId)
                .ToListAsync();
        }

        public async Task<Floor> GetByIdAsync(int id)
        {
            return await _context.Floors.FindAsync(id);
        }

        public async Task AddAsync(Floor floor)
        {
            await _context.Floors.AddAsync(floor);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var floor = await _context.Floors.FindAsync(id);
            if (floor != null)
            {
                _context.Floors.Remove(floor);
                await _context.SaveChangesAsync();
            }
        }
    }

}
