using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service.Dtos;

namespace SmartSpaceManager.Service.Interface
{
    public interface IDeskService
    {
        Task<IEnumerable<Desk>> GetDesksByFloor(int floorId);
        Task<Desk> GetDeskById(int id);
        Task AddDesk(DeskDto deskDto);
        Task UpdateDesk(DeskDto deskDto);
        Task DeleteDesk(int id);
    }
}
