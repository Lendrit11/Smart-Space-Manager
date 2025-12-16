using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.DAL.Interfaces
{
    public interface ISeatRepository
    {
        Task<IEnumerable<Seat>> GetSeatsByDeskAsync(int deskId);
        Task<Seat> GetSeatByIdAsync(int id);
        Task AddSeatAsync(Seat seat);
        Task UpdateSeatAsync(Seat seat);
        Task DeleteSeatAsync(int id);
    }
}
