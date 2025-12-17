using SmartSpaceManager.Domain.model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartSpaceManager.DAL.Interfaces
{
    public interface IReservationRepository
    {
        Task AddAsync(Reservation reservation);
        Task<Reservation?> GetByIdAsync(int id);
        Task UpdateAsync(Reservation reservation);
        Task DeleteAsync(Reservation reservation);
        Task<List<Reservation>> GetAllAsync();
    }
}
