using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartSpaceManager.DAL.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Floors_FloorId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_FloorId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "FloorId",
                table: "Reservations");

            migrationBuilder.AddColumn<int>(
                name: "reservationId",
                table: "Seats",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Seats_reservationId",
                table: "Seats",
                column: "reservationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Seats_Reservations_reservationId",
                table: "Seats",
                column: "reservationId",
                principalTable: "Reservations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Seats_Reservations_reservationId",
                table: "Seats");

            migrationBuilder.DropIndex(
                name: "IX_Seats_reservationId",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "reservationId",
                table: "Seats");

            migrationBuilder.AddColumn<int>(
                name: "FloorId",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_FloorId",
                table: "Reservations",
                column: "FloorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Floors_FloorId",
                table: "Reservations",
                column: "FloorId",
                principalTable: "Floors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
