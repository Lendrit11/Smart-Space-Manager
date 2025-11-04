using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.Domain.model
{
    public enum ReservationStatus { Pending, Confirmed, Cancelled }

    public class Reservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoomId { get; set; }
        public DateOnly Date { get; set; } // .NET 6+; otherwise use DateTime with .Date
        public int TimeSlotId { get; set; }
        public ReservationStatus Status { get; set; } = ReservationStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public Room? Room { get; set; }
        public TimeSlot? TimeSlot { get; set; }
    }
}
