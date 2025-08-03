using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YılmazMotorWeb.Dal.Migrations
{
    /// <inheritdoc />
    public partial class DiscountTablefx1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Discounts",
                type: "bit",
                nullable: false,
                computedColumnSql: "CAST(CASE WHEN GETDATE() BETWEEN StartDate AND EndDate THEN 1 ELSE 0 END AS bit)",
                oldClrType: typeof(bool),
                oldType: "bit",
                oldComputedColumnSql: "CASE WHEN GETDATE() BETWEEN StartDate AND EndDate THEN 1 ELSE 0 END");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Discounts",
                type: "bit",
                nullable: false,
                computedColumnSql: "CASE WHEN GETDATE() BETWEEN StartDate AND EndDate THEN 1 ELSE 0 END",
                stored: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldComputedColumnSql: "CAST(CASE WHEN GETDATE() BETWEEN StartDate AND EndDate THEN 1 ELSE 0 END AS bit)",
                oldStored: null);
        }
    }
}
