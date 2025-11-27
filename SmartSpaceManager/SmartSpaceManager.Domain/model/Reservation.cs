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
        public int FloorId { get; set; }
        public DateTime Date { get; set; }
        public int TimeSlotId { get; set; }
        public string Status { get; set; } = "pending";
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public User User { get; set; }
        public Floor Floor { get; set; }
        public TimeSlot TimeSlot { get; set; }
    }
}
