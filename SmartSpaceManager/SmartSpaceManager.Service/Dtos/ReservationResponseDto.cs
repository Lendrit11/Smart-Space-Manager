using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.Service.Dtos
{
    public class ReservationResponseDto
    {
        public int ReservationId { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Description { get; set; }
        public string ReservationStatus { get; set; }
        public string TimeSlotStatus { get; set; }
        public int SeatId { get; set; }
    }

}
