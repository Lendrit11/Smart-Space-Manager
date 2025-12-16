using SmartSpaceManager.Service.Dtos;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Service.Interface;

namespace SmartSpaceManager.Service.Services
{
    public class DeskService : IDeskService
    {
        private readonly IDeskRepository _deskRepository;

        public DeskService(IDeskRepository deskRepository)
        {
            _deskRepository = deskRepository;
        }

        public Task<IEnumerable<Desk>> GetDesksByFloor(int floorId)
        {
            return _deskRepository.GetDesksByFloorAsync(floorId);
        }

        public Task<Desk> GetDeskById(int id)
        {
            return _deskRepository.GetDeskByIdAsync(id);
        }

        public async Task AddDesk(DeskDto deskDto)
        {
            var desk = new Desk
            {
                Name = deskDto.Name,
                PositionX = deskDto.PositionX,
                PositionY = deskDto.PositionY,
                Width = deskDto.Width,
                Height = deskDto.Height,
                Shape = deskDto.Shape,
                FloorId = deskDto.FloorId,
                Seats = deskDto.Seats?.Select(s => new Seat
                {
                    Name = s.Name,
                    PositionX = s.PositionX,
                    PositionY = s.PositionY,
                    reservationId = s.ReservationId // nullable
                }).ToList() ?? new List<Seat>()
            };

            await _deskRepository.AddDeskAsync(desk);
        }

        public async Task UpdateDesk(DeskDto deskDto)
        {
            // 1️⃣ Merr desk ekzistues nga DB
            var desk = await _deskRepository.GetDeskByIdAsync(deskDto.Id);
            if (desk == null)
                throw new Exception("Desk nuk u gjet.");

            // 2️⃣ Update vetëm fushat që do të ndryshohen
            if (!string.IsNullOrEmpty(deskDto.Name))
                desk.Name = deskDto.Name;

            desk.PositionX = deskDto.PositionX != 0 ? deskDto.PositionX : desk.PositionX;
            desk.PositionY = deskDto.PositionY != 0 ? deskDto.PositionY : desk.PositionY;
            desk.Width = deskDto.Width != 0 ? deskDto.Width : desk.Width;
            desk.Height = deskDto.Height != 0 ? deskDto.Height : desk.Height;

            if (!string.IsNullOrEmpty(deskDto.Shape))
                desk.Shape = deskDto.Shape;

            if (deskDto.FloorId != 0)
                desk.FloorId = deskDto.FloorId;

            // 3️⃣ Manage Seats
            if (deskDto.Seats != null)
            {
                if (deskDto.Seats.Count == 0)
                {
                    // DTO ka listë bosh → vetëm nëse DB nuk ka asnjë Seat
                    if (desk.Seats == null || !desk.Seats.Any())
                    {
                        desk.Seats = new List<Seat>(); // bosh
                    }
                    // nëse DB ka karriga, i lë ashtu, nuk bëhet update
                }
                else
                {
                    // DTO ka karriga → update vetëm ato të reja ose ndryshime
                    foreach (var seatDto in deskDto.Seats)
                    {
                        var existingSeat = desk.Seats.FirstOrDefault(s => s.Id == seatDto.Id);
                        if (existingSeat != null)
                        {
                            // Update fushat e ndryshuara
                            existingSeat.Name = seatDto.Name ?? existingSeat.Name;
                            existingSeat.PositionX = seatDto.PositionX != 0 ? seatDto.PositionX : existingSeat.PositionX;
                            existingSeat.PositionY = seatDto.PositionY != 0 ? seatDto.PositionY : existingSeat.PositionY;
                            existingSeat.reservationId = seatDto.ReservationId > 0 ? seatDto.ReservationId : existingSeat.reservationId;
                        }
                        else
                        {
                            // Shto Seat të ri
                            desk.Seats.Add(new Seat
                            {
                                Name = seatDto.Name,
                                PositionX = seatDto.PositionX,
                                PositionY = seatDto.PositionY,
                                DeskId = desk.Id,
                                reservationId = seatDto.ReservationId > 0 ? seatDto.ReservationId : (int?)null
                            });
                        }
                    }
                }
            }

            await _deskRepository.UpdateDeskAsync(desk);
        }

        public Task DeleteDesk(int id)
        {
            return _deskRepository.DeleteDeskAsync(id);
        }
    }
}
