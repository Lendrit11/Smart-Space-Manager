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
    public class TimeSlotRepository : ITimeSlotRepository
    {
        private readonly AppDbContext _context;
        public TimeSlotRepository(AppDbContext context) => _context = context;

        public async Task AddAsync(TimeSlot slot)
        {
            await _context.TimeSlots.AddAsync(slot);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TimeSlot slot)
        {
            _context.TimeSlots.Update(slot);
            await _context.SaveChangesAsync();
        }

        public async Task<TimeSlot?> GetByIdAsync(int id)
        {
            return await _context.TimeSlots.FindAsync(id);
        }

        public async Task<bool> HasOverlap(TimeSpan start, TimeSpan end, int? excludeId = null)
        {
            return await _context.TimeSlots.AnyAsync(ts =>
                (excludeId == null || ts.Id != excludeId) &&
                ts.Status == TimeSlotStatus.Active &&
                start < ts.EndTime &&
                end > ts.StartTime
            );
        }
    }
}
