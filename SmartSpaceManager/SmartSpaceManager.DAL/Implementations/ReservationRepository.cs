using Microsoft.EntityFrameworkCore;
using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Domain.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartSpaceManager.DAL.Implementations
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly AppDbContext _context;
        public ReservationRepository(AppDbContext context)
        {
            _context = context;
        }

        // Get all reservations for a specific date
        public async Task<List<Reservation>> GetAllAsync(DateTime date)
        {
            return await _context.Reservations
                .Where(r => r.Date.Date == date.Date)
                .Include(r => r.seats)
                .Include(r => r.TimeSlot) // Include TimeSlot
                .ToListAsync();
        }

        // Get reservation by id
        public async Task<Reservation?> GetByIdAsync(int id)
        {
            return await _context.Reservations
                .Include(r => r.seats)
                .Include(r => r.TimeSlot) // Include TimeSlot
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        // Add new reservation
        public async Task AddAsync(Reservation reservation)
        {
            await _context.Reservations.AddAsync(reservation);
            await _context.SaveChangesAsync();
        }

        // Update reservation
        public async Task UpdateAsync(Reservation reservation)
        {
            _context.Reservations.Update(reservation);
            await _context.SaveChangesAsync();
        }

        // Delete reservation
        public async Task DeleteAsync(Reservation reservation)
        {
            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
        }
        public async Task<List<Reservation>> GetAllAsync()
        {
            return await _context.Reservations
                .Include(r => r.TimeSlot)
                .Include(r => r.seats)
                .ToListAsync();
        }

    }
}
