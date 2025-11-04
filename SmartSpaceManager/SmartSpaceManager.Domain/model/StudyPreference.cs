using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartSpaceManager.Domain.model
{
    public class StudyPreference
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? PreferenceType { get; set; }
        public string? PreferenceValue { get; set; }

        public User? User { get; set; }
    }
}
