using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.DAL.Configurations
{
    public class TimeSlotConfiguration : IEntityTypeConfiguration<TimeSlot>
    {
        public void Configure(EntityTypeBuilder<TimeSlot> builder)
        {
            builder.ToTable("TimeSlots");

            builder.HasKey(t => t.Id);

            builder.Property(t => t.StartTime).IsRequired();
            builder.Property(t => t.EndTime).IsRequired();
            builder.Property(t => t.Description).HasMaxLength(100);
        }
    }
}
