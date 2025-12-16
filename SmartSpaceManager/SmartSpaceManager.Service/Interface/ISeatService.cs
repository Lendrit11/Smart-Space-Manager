using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Dtos;

namespace SmartSpaceManager.Service.Interface
{
    public interface ISeatService
    {
        Task<IEnumerable<Seat>> GetSeatsByDesk(int deskId);
        Task<Seat> GetSeatById(int id);
        Task AddSeat(SeatsDto seatsDto);
        Task UpdateSeat(SeatsDto seatsDto);
        Task DeleteSeat(int id);
    }
}
