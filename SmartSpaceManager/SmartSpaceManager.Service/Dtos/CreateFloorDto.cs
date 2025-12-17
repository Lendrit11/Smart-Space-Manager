using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.Service.Dtos
{
    public class CreateFloorDto
    {
        public int BuildingId { get; set; }
        public int FloorNumber { get; set; }
        public string? Description { get; set; }
        public int Width { get; set; } = 1000;
        public int Height { get; set; } = 1000;
        public float Scale { get; set; } = 1f;
    }
}
