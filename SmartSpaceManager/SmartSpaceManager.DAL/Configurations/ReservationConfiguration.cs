using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.DAL.Configurations
{
    public class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
    {
        public void Configure(EntityTypeBuilder<Reservation> builder)
        {
            builder.ToTable("Reservations");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Status)
                .HasMaxLength(20)
                .HasDefaultValue("pending");

            builder.Property(r => r.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            builder.Property(r => r.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");

            builder.HasOne(r => r.User)
                .WithMany(u => u.Reservations)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);



            builder.HasOne(r => r.TimeSlot)
                .WithMany(t => t.Reservations)
                .HasForeignKey(r => r.TimeSlotId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
