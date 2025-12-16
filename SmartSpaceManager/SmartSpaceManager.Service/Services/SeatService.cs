using SmartSpaceManager.Service.Dtos;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Service.Interface;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SmartSpaceManager.Service.Services
{

    public class SeatService : ISeatService
    {
        private readonly ISeatRepository _seatRepository;

        public SeatService(ISeatRepository seatRepository)
        {
            _seatRepository = seatRepository;
        }

        public Task<IEnumerable<Seat>> GetSeatsByDesk(int deskId)
        {
            return _seatRepository.GetSeatsByDeskAsync(deskId);
        }

        public Task<Seat> GetSeatById(int id)
        {
            return _seatRepository.GetSeatByIdAsync(id);
        }

        public async Task AddSeat(SeatsDto seatDto)
        {
            var seat = new Seat
            {
                DeskId = seatDto.DeskId,
                Name = seatDto.Name,
                PositionX = seatDto.PositionX,
                PositionY = seatDto.PositionY,
                // Nëse lista e rezervimeve ka të dhëna, por nuk ka repository,
                // nuk mund t’i lidhim aktualisht, lëmë null
                reservationId = null
            };

            await _seatRepository.AddSeatAsync(seat);
        }

        public async Task UpdateSeat(SeatsDto seatDto)
        {
            var seat = await _seatRepository.GetSeatByIdAsync(seatDto.Id);
            if (seat == null)
                throw new Exception("Seat nuk u gjet.");

            // Vetëm update fushat që nuk lidhen me rezervimet
            seat.Name = seatDto.Name ?? seat.Name;
            seat.PositionX = seatDto.PositionX != 0 ? seatDto.PositionX : seat.PositionX;
            seat.PositionY = seatDto.PositionY != 0 ? seatDto.PositionY : seat.PositionY;
            seat.DeskId = seatDto.DeskId != 0 ? seatDto.DeskId : seat.DeskId;

            // reservationId nuk preket, pra nuk ndryshon FK
            await _seatRepository.UpdateSeatAsync(seat);
        }

        public Task DeleteSeat(int id)
        {
            return _seatRepository.DeleteSeatAsync(id);
        }
    }


}