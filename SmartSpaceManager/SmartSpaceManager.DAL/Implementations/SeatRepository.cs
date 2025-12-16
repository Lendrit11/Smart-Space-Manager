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
    public class SeatRepository : ISeatRepository
    {
        private readonly AppDbContext _context;

        public SeatRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Seat>> GetSeatsByDeskAsync(int deskId)
        {
            return await _context.Seats
                .Where(s => s.DeskId == deskId)
                .ToListAsync();
        }

        public async Task<Seat> GetSeatByIdAsync(int id)
        {
            return await _context.Seats.FindAsync(id);
        }

        public async Task AddSeatAsync(Seat seat)
        {
            await _context.Seats.AddAsync(seat);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateSeatAsync(Seat seat)
        {
            _context.Seats.Update(seat);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSeatAsync(int id)
        {
            var seat = await _context.Seats.FindAsync(id);
            if (seat != null)
            {
                _context.Seats.Remove(seat);
                await _context.SaveChangesAsync();
            }
        }
    }
}
