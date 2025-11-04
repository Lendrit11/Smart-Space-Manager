
using Microsoft.EntityFrameworkCore;
using SmartSpaceManager.Domain.model;
namespace SmartSpaceManager.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<UserRole> UserRoles { get; set; } = null!;
        public DbSet<Building> Buildings { get; set; } = null!;
        public DbSet<Floor> Floors { get; set; } = null!;
        public DbSet<Room> Rooms { get; set; } = null!;
        public DbSet<TimeSlot> TimeSlots { get; set; } = null!;
        public DbSet<StudyPreference> StudyPreferences { get; set; } = null!;
        public DbSet<Reservation> Reservations { get; set; } = null!;
        public DbSet<ActivityLog> ActivityLogs { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Table names and keys (match SQL names)
            modelBuilder.Entity<Building>(b => {
                b.ToTable("Buildings");
                b.HasKey(x => x.Id);
                b.Property(x => x.Name).IsRequired().HasMaxLength(100);
                b.Property(x => x.Address).HasMaxLength(255);
            });

            modelBuilder.Entity<Floor>(f => {
                f.ToTable("Floors");
                f.HasKey(x => x.Id);
                f.Property(x => x.FloorNumber).IsRequired();
                f.Property(x => x.Description).HasMaxLength(255);
                f.HasOne(x => x.Building).WithMany(b => b.Floors).HasForeignKey(x => x.BuildingId).OnDelete(DeleteBehavior.Cascade);
                f.HasIndex(x => x.BuildingId).HasDatabaseName("idx_building_id");
            });

            modelBuilder.Entity<Room>(r => {
                r.ToTable("Rooms");
                r.HasKey(x => x.Id);
                r.Property(x => x.Name).IsRequired().HasMaxLength(100);
                r.Property(x => x.Capacity).HasDefaultValue(1);
                r.Property(x => x.PositionX).HasDefaultValue(0);
                r.Property(x => x.PositionY).HasDefaultValue(0);
                r.Property(x => x.Width).HasDefaultValue(100);
                r.Property(x => x.Height).HasDefaultValue(60);
                r.Property(x => x.Description).HasColumnType("text");
                r.HasOne(x => x.Floor).WithMany(f => f.Rooms).HasForeignKey(x => x.FloorId).OnDelete(DeleteBehavior.Cascade);
                r.HasIndex(x => x.FloorId).HasDatabaseName("idx_floor_id");
                r.Property(x => x.Shape).HasConversion<string>().HasDefaultValue(RoomShape.Rectangle);
            });

            modelBuilder.Entity<User>(u => {
                u.ToTable("Users");
                u.HasKey(x => x.Id);
                u.HasIndex(x => x.Username).IsUnique();
                u.HasIndex(x => x.Email).IsUnique();
                u.Property(x => x.Username).IsRequired().HasMaxLength(50);
                u.Property(x => x.Email).IsRequired().HasMaxLength(100);
                u.Property(x => x.PasswordHash).IsRequired().HasMaxLength(255);
                u.Property(x => x.FullName).HasMaxLength(100);
                u.Property(x => x.ProfilePhoto).HasMaxLength(255);
                u.Property(x => x.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<Role>(ro => {
                ro.ToTable("Roles");
                ro.HasKey(x => x.Id);
                ro.Property(x => x.Name).IsRequired().HasMaxLength(50);
                ro.HasIndex(x => x.Name).IsUnique();
            });

            modelBuilder.Entity<UserRole>(ur => {
                ur.ToTable("UserRoles");
                ur.HasKey(x => new { x.UserId, x.RoleId });
                ur.HasOne(x => x.User).WithMany(u => u.UserRoles).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
                ur.HasOne(x => x.Role).WithMany(r => r.UserRoles).HasForeignKey(x => x.RoleId).OnDelete(DeleteBehavior.Cascade);
                ur.HasIndex(x => x.UserId).HasDatabaseName("idx_user_roles_user_id");
                ur.HasIndex(x => x.RoleId).HasDatabaseName("idx_user_roles_role_id");
            });

            modelBuilder.Entity<TimeSlot>(ts => {
                ts.ToTable("TimeSlots");
                ts.HasKey(x => x.Id);
                ts.Property(x => x.StartTime).IsRequired();
                ts.Property(x => x.EndTime).IsRequired();
                ts.Property(x => x.Description).HasMaxLength(100);
            });

            modelBuilder.Entity<StudyPreference>(sp => {
                sp.ToTable("StudyPreferences");
                sp.HasKey(x => x.Id);
                sp.Property(x => x.PreferenceType).HasMaxLength(100);
                sp.Property(x => x.PreferenceValue).HasMaxLength(255);
                sp.HasOne(x => x.User).WithMany(u => u.StudyPreferences).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
                sp.HasIndex(x => x.UserId).HasDatabaseName("idx_user_id");
            });

            modelBuilder.Entity<Reservation>(res => {
                res.ToTable("Reservations");
                res.HasKey(x => x.Id);
                res.Property(x => x.Status).HasConversion<string>().HasDefaultValue(ReservationStatus.Pending);
                // DateOnly mapping for providers that support it; otherwise store DateTime
                res.Property(x => x.Date).HasColumnType("date").IsRequired();
                res.Property(x => x.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                res.Property(x => x.UpdatedAt).ValueGeneratedOnAddOrUpdate().HasDefaultValueSql("CURRENT_TIMESTAMP");
                res.HasOne(x => x.User).WithMany(u => u.Reservations).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
                res.HasOne(x => x.Room).WithMany(r => r.Reservations).HasForeignKey(x => x.RoomId).OnDelete(DeleteBehavior.Cascade);
                res.HasOne(x => x.TimeSlot).WithMany(ts => ts.Reservations).HasForeignKey(x => x.TimeSlotId).OnDelete(DeleteBehavior.Cascade);
                res.HasIndex(x => new { x.RoomId, x.Date, x.TimeSlotId }).IsUnique().HasDatabaseName("UX_Reservations_Room_Date_Timeslot");
                res.HasIndex(x => x.UserId).HasDatabaseName("idx_user_reservations");
                res.HasIndex(x => x.RoomId).HasDatabaseName("idx_room_reservations");
            });

            modelBuilder.Entity<ActivityLog>(al => {
                al.ToTable("ActivityLogs");
                al.HasKey(x => x.Id);
                al.Property(x => x.Action).HasMaxLength(255);
                al.Property(x => x.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                al.HasOne(x => x.User).WithMany(u => u.ActivityLogs).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.SetNull);
            });
        }
    }
}
