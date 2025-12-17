using SmartSpaceManager.Domain.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.DAL.Interfaces
{
    public interface ITimeSlotRepository
    {
        Task AddAsync(TimeSlot slot);
        Task UpdateAsync(TimeSlot slot);
        Task<bool> HasOverlap(TimeSpan start, TimeSpan end, int? excludeId = null);
        Task<TimeSlot?> GetByIdAsync(int id);
    }
}
