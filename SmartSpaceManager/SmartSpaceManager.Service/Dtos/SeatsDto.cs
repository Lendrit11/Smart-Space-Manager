using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.Service.Dtos
{
    public class SeatsDto
    {
        public int Id { get; set; }
        public int DeskId { get; set; }
        public string? Name { get; set; }
        public int PositionX { get; set; }
        public int PositionY { get; set; }
        public List<int> ReservationIds { get; set; }
    }
}
