using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartSpaceManager.Domain.model;

namespace SmartSpaceManager.DAL.Configurations
{
    public class FloorConfiguration : IEntityTypeConfiguration<Floor>
    {
        public void Configure(EntityTypeBuilder<Floor> builder)
        {
            builder.ToTable("Floors");

            builder.HasKey(f => f.Id);

            builder.Property(f => f.FloorNumber)
                .IsRequired();

            builder.Property(f => f.Description)
                .HasMaxLength(255);

            builder.HasOne(f => f.Building)
                .WithMany(b => b.Floors)
                .HasForeignKey(f => f.BuildingId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(f => f.Desks)
                .WithOne(d => d.Floor)
                .HasForeignKey(d => d.FloorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(f => f.Reservations)
                .WithOne(r => r.Floor)
                .HasForeignKey(r => r.FloorId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
