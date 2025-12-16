using Microsoft.EntityFrameworkCore;
using SmartSpaceManager.DAL.Interfaces;
using SmartSpaceManager.Domain.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.DAL.Implementations
{
    public class ActivityLogRepository: IActivityLogRepository
    {
        private readonly AppDbContext _context;
        public ActivityLogRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddAsyncLog(ActivityLog activityLog)
        {
            await _context.ActivityLogs.AddAsync(activityLog);
            await _context.SaveChangesAsync();
        }
        public async Task<List<ActivityLog>> GetByUserIdAsync(int id)
        {
            return await _context.ActivityLogs
                .Where(x=>x.UserId == id)
                .OrderByDescending(x=>x.CreatedAt)
                .ToListAsync();
        }


    }
}
