using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SmartSpaceManager.Domain.model
{
    public class Seat
    {
        public int Id { get; set; }
        public int DeskId { get; set; }
        public string? Name { get; set; }
        public int PositionX { get; set; }
        public int PositionY { get; set; }
        public int? reservationId { get; set; }
        public Reservation? Reservation { get; set; }
        public Desk Desk { get; set; }
    }
}
