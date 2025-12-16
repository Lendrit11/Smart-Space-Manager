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
    public class DeskRepository : IDeskRepository
    {
        private readonly AppDbContext _context;

        public DeskRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Desk>> GetDesksByFloorAsync(int floorId)
        {
            return await _context.Desks
                .Include(d => d.Seats)
                .Where(d => d.FloorId == floorId)
                .ToListAsync();
        }

        public async Task<Desk> GetDeskByIdAsync(int id)
        {
            return await _context.Desks
                .Include(d => d.Seats)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task AddDeskAsync(Desk desk)
        {
            await _context.Desks.AddAsync(desk);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateDeskAsync(Desk desk)
        {
            _context.Desks.Update(desk);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDeskAsync(int id)
        {
            var desk = await _context.Desks.FindAsync(id);
            if (desk != null)
            {
                _context.Desks.Remove(desk);
                await _context.SaveChangesAsync();
            }
        }

    }
}
