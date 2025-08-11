using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YılmazMotorWeb.Dal.Migrations
{
    /// <inheritdoc />
    public partial class coupontablesfx : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Coupons_CouponId",
                table: "Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_UserCouponCodes_AspNetUsers_UserId1",
                table: "UserCouponCodes");

            migrationBuilder.DropForeignKey(
                name: "FK_UserCouponCodes_Coupons_CouponId",
                table: "UserCouponCodes");

            migrationBuilder.DropForeignKey(
                name: "FK_UserTasks_AspNetUsers_UserId1",
                table: "UserTasks");

            migrationBuilder.DropIndex(
                name: "IX_UserTasks_UserId1",
                table: "UserTasks");

            migrationBuilder.DropIndex(
                name: "IX_UserCouponCodes_UserId1",
                table: "UserCouponCodes");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserTasks");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserCouponCodes");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "UserTasks",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "UserCouponCodes",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_UserTasks_UserId",
                table: "UserTasks",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCouponCodes_UserId",
                table: "UserCouponCodes",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Coupons_CouponId",
                table: "Tasks",
                column: "CouponId",
                principalTable: "Coupons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCouponCodes_AspNetUsers_UserId",
                table: "UserCouponCodes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCouponCodes_Coupons_CouponId",
                table: "UserCouponCodes",
                column: "CouponId",
                principalTable: "Coupons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserTasks_AspNetUsers_UserId",
                table: "UserTasks",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Coupons_CouponId",
                table: "Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_UserCouponCodes_AspNetUsers_UserId",
                table: "UserCouponCodes");

            migrationBuilder.DropForeignKey(
                name: "FK_UserCouponCodes_Coupons_CouponId",
                table: "UserCouponCodes");

            migrationBuilder.DropForeignKey(
                name: "FK_UserTasks_AspNetUsers_UserId",
                table: "UserTasks");

            migrationBuilder.DropIndex(
                name: "IX_UserTasks_UserId",
                table: "UserTasks");

            migrationBuilder.DropIndex(
                name: "IX_UserCouponCodes_UserId",
                table: "UserCouponCodes");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UserTasks",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "UserTasks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UserCouponCodes",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "UserCouponCodes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserTasks_UserId1",
                table: "UserTasks",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_UserCouponCodes_UserId1",
                table: "UserCouponCodes",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Coupons_CouponId",
                table: "Tasks",
                column: "CouponId",
                principalTable: "Coupons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCouponCodes_AspNetUsers_UserId1",
                table: "UserCouponCodes",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCouponCodes_Coupons_CouponId",
                table: "UserCouponCodes",
                column: "CouponId",
                principalTable: "Coupons",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserTasks_AspNetUsers_UserId1",
                table: "UserTasks",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
