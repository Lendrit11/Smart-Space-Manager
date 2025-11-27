using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.Domain.model
{
    public class Floor
    {
        public int Id { get; set; }
        public int BuildingId { get; set; }
        public int FloorNumber { get; set; }
        public string? Description { get; set; }

        public Building? Building { get; set; }
        public ICollection<Desk> Desks { get; set; }
        public ICollection<Reservation> Reservations { get; set; }
    }
}
