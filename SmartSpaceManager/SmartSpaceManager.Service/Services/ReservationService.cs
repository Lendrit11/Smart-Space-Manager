using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Dtos;

namespace SmartSpaceManager.Service.Services
{
    public class ReservationService
    {
        private readonly IReservationRepository _reservationRepo;
        private readonly ITimeSlotRepository _timeSlotRepo;
        private readonly ISeatRepository _seatRepo;

        public ReservationService(
            IReservationRepository reservationRepo,
            ITimeSlotRepository timeSlotRepo,
            ISeatRepository seatRepo)
        {
            _reservationRepo = reservationRepo;
            _timeSlotRepo = timeSlotRepo;
            _seatRepo = seatRepo;
        }

        // CREATE
        public async Task<int> CreateReservationAsync(CreateReservationDto dto, int userId)
        {
            // 1️⃣ Kontrollo nëse ulësja është e lirë për këtë datë dhe orar specifike
            // Dërgojmë SeatId si listë sepse HasOverlap pret List<int>
            var isOccupied = await _timeSlotRepo.HasOverlap(
                new List<int> { dto.SeatId },
                dto.Date,
                dto.StartTime,
                dto.EndTime
            );

            if (isOccupied)
                throw new Exception("Kjo ulëse është e zënë për këtë orar, ose data ka kaluar.");

            // (Opsionale) Start Transaction këtu nëse Repository yt e mbështet

            // 2️⃣ Krijo TimeSlot
            var timeSlot = new TimeSlot
            {
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Description = dto.Description,
                Status = TimeSlotStatus.Active
            };
            await _timeSlotRepo.AddAsync(timeSlot);

            // 3️⃣ Krijo Reservation
            var reservation = new Reservation
            {
                UserId = userId,
                Date = dto.Date, // Këtu ruhet data që vjen nga DTO
                Status = ReservationStatus.Active,
                TimeSlotId = timeSlot.Id,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            await _reservationRepo.AddAsync(reservation);

            // 4️⃣ Merr ulësen dhe lidhe me rezervimin
            var seat = await _seatRepo.GetSeatByIdAsync(dto.SeatId);
            if (seat == null)
            {
                // Këtu do të duhej të bëhej Rollback nëse ka transaksion
                throw new Exception("Ulësja nuk u gjet.");
            }

            // Përditëso seat me ID-në e rezervimit të ri
            seat.reservationId = reservation.Id;
            await _seatRepo.UpdateSeatAsync(seat);

            // Lidhja në memorie për objektin (në rast se do t'i përdorësh menjëherë)
            reservation.seats.Add(seat);
            timeSlot.Reservations.Add(reservation);

            // 5️⃣ Update përfundimtar
            await _reservationRepo.UpdateAsync(reservation);

            return reservation.Id;
        }
        // GET
        public async Task<ReservationResponseDto> GetReservationByIdAsync(int reservationId)
        {
            var reservation = await _reservationRepo.GetByIdAsync(reservationId);
            if (reservation == null) throw new Exception("Reservation not found.");

            // Merr seat të parë (nëse ka)
            var seat = reservation.seats.FirstOrDefault();

            return new ReservationResponseDto
            {
                ReservationId = reservation.Id,
                Date = reservation.Date,
                StartTime = reservation.TimeSlot?.StartTime ?? TimeSpan.Zero,
                EndTime = reservation.TimeSlot?.EndTime ?? TimeSpan.Zero,
                Description = reservation.TimeSlot?.Description ?? "",
                ReservationStatus = reservation.Status.ToString(),
                TimeSlotStatus = reservation.TimeSlot?.Status.ToString() ?? "",
                SeatId = seat?.Id ?? 0
            };
        }

        // CANCEL
        public async Task CancelReservationAsync(int reservationId)
        {
            var reservation = await _reservationRepo.GetByIdAsync(reservationId);
            if (reservation == null) throw new Exception("Reservation not found.");

            // 1️⃣ Cancel Reservation
            reservation.Status = ReservationStatus.Cancelled;
            reservation.UpdatedAt = DateTime.UtcNow;

            // 2️⃣ Cancel TimeSlot nëse ekziston
            if (reservation.TimeSlot != null)
                reservation.TimeSlot.Status = TimeSlotStatus.Cancelled;

            // 3️⃣ Clear të gjitha Seats të lidhura
            if (reservation.seats != null && reservation.seats.Any())
            {
                foreach (var seat in reservation.seats)
                {
                    seat.reservationId = null;
                    await _seatRepo.UpdateSeatAsync(seat);
                }
            }

            // 4️⃣ Update Reservation në DB
            await _reservationRepo.UpdateAsync(reservation);
        }

        // GET ALL
        public async Task<List<ReservationResponseDto>> GetAllReservationsAsync()
        {
            var reservations = await _reservationRepo.GetAllAsync(); // supozojmë që repository ka këtë metodë
            var result = new List<ReservationResponseDto>();

            foreach (var reservation in reservations)
            {
                var seat = reservation.seats.FirstOrDefault();

                result.Add(new ReservationResponseDto
                {
                    ReservationId = reservation.Id,
                    Date = reservation.Date,
                    StartTime = reservation.TimeSlot?.StartTime ?? TimeSpan.Zero,
                    EndTime = reservation.TimeSlot?.EndTime ?? TimeSpan.Zero,
                    Description = reservation.TimeSlot?.Description ?? "",
                    ReservationStatus = reservation.Status.ToString(),
                    TimeSlotStatus = reservation.TimeSlot?.Status.ToString() ?? "",
                    SeatId = seat?.Id ?? 0
                });
            }

            return result;
        }

    }
}
