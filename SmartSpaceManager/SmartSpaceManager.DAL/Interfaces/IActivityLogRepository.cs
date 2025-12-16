using SmartSpaceManager.Domain.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.DAL.Interfaces
{
    public interface IActivityLogRepository
    {
        Task AddAsyncLog(ActivityLog activityLog);
        Task<List<ActivityLog>> GetByUserIdAsync(int userid);
    }
}
