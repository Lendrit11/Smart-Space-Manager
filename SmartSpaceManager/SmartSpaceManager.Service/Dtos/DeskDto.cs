using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.Service.Dtos
{
    public class DeskDto
    {
        public int Id { get; set; }
        public int? FloorId { get; set; }
        public string Name { get; set; }
        public int PositionX { get; set; }
        public int PositionY { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string Shape { get; set; }

        public ICollection<SeatDto> Seats { get; set; } = new List<SeatDto>();
    }

    public class SeatDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int PositionX { get; set; }
        public int PositionY { get; set; }
        public int? ReservationId { get; set; } // ⚡ nullable
    }

}
