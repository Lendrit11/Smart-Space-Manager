using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.DAL.Configurations
{
    public class DeskConfiguration : IEntityTypeConfiguration<Desk>
    {
        public void Configure(EntityTypeBuilder<Desk> builder)
        {
            builder.ToTable("Desk");

            builder.HasKey(d => d.Id);

            builder.Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(d => d.Shape)
                .HasMaxLength(20)
                .HasDefaultValue("rectangle");

            builder.Property(d => d.Width).HasDefaultValue(100);
            builder.Property(d => d.Height).HasDefaultValue(60);
            builder.Property(d => d.PositionX).HasDefaultValue(0);
            builder.Property(d => d.PositionY).HasDefaultValue(0);

            builder.HasOne(d => d.Floor)
                .WithMany(f => f.Desks)
                .HasForeignKey(d => d.FloorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(d => d.Seats)
                .WithOne(s => s.Desk)
                .HasForeignKey(s => s.DeskId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
