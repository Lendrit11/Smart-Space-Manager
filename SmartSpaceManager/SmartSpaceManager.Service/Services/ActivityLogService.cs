using SmartSpaceManager.Domain.model;
using SmartSpaceManager.Service;
using SmartSpaceManager.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.Service.Services
{
    public class ActivityLogService
    {
        private readonly IActivityLogRepository _repository;
        public ActivityLogService(IActivityLogRepository repository)
        {
            _repository = repository;
        }
        public async Task LogAsync(int userId, string action)
        {
            var log = new ActivityLog
            {
                UserId = userId,
                Action = action,
                CreatedAt = DateTime.UtcNow
            };
            await _repository.AddAsyncLog(log);
        }
    }
}
