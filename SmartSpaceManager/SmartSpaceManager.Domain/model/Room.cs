using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.Domain.model
{
    public enum RoomShape { Rectangle, Circle }

    public class Room
    {
        public int Id { get; set; }
        public int FloorId { get; set; }
        public string Name { get; set; } = null!;
        public int Capacity { get; set; } = 1;
        public string? Description { get; set; }

        public int PositionX { get; set; } = 0;
        public int PositionY { get; set; } = 0;
        public int Width { get; set; } = 100;
        public int Height { get; set; } = 60;

        public RoomShape Shape { get; set; } = RoomShape.Rectangle;

        public Floor? Floor { get; set; }
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
