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

        public async Task<bool> HasOverlap(List<int> requestedSeatIds, DateTime date, TimeSpan start, TimeSpan end, int? excludeReservationId = null)
        {
            // 1. Kontrolli i datës: Mos lejo rezervime në të kaluarën
            // Kombinojmë datën me orën e fillimit për saktësi
            var requestedDateTime = date.Date.Add(start);
            if (requestedDateTime < DateTime.Now)
            {
                return true; // Bllokohet sepse data/ora ka kaluar
            }

            // 2. Kontrolli i mbivendosjes në DB
            // Fillojmë kërkimin nga Reservations sepse aty lidhet Data, TimeSlot dhe Seats
            return await _context.Reservations
                .Where(r => r.Status != ReservationStatus.Cancelled) // Vetëm ato që s'janë anuluar
                .Where(r => r.Date.Date == date.Date)               // Vetëm për datën e kërkuar
                .Where(r => excludeReservationId == null || r.Id != excludeReservationId)
                .AnyAsync(r =>
                    // Kontrollojmë nëse ndonjë nga ulëset e kërkuara është në këtë rezervim
                    r.seats.Any(s => requestedSeatIds.Contains(s.Id)) &&

                    // Kontrollojmë nëse orari i rezervimit ekzistues mbivendoset me orarin e ri
                    (start < r.TimeSlot.EndTime && end > r.TimeSlot.StartTime)
                );
        }
    }
}

