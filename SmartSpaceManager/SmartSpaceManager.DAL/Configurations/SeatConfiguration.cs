using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.DAL.Configurations
{
    public class SeatConfiguration : IEntityTypeConfiguration<Seat>
    {
        public void Configure(EntityTypeBuilder<Seat> builder)
        {
            builder.ToTable("Seats");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Name)
                .HasMaxLength(50);

            builder.Property(s => s.PositionX).HasDefaultValue(0);
            builder.Property(s => s.PositionY).HasDefaultValue(0);

            builder.HasOne(s => s.Desk)
                .WithMany(d => d.Seats)
                .HasForeignKey(s => s.DeskId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
