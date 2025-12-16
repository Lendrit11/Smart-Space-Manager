using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SmartSpaceManager.Domain.model
{
    public class Desk
    {
        public int Id { get; set; }
        public int? FloorId { get; set; }
        public string Name { get; set; }
        public int PositionX { get; set; }
        public int PositionY { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string Shape { get; set; }
        [JsonIgnore]
        public Floor? Floor { get; set; }
        public ICollection<Seat> Seats { get; set; }

    }
}
