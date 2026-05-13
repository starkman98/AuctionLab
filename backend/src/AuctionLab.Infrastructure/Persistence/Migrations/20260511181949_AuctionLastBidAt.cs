using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuctionLab.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AuctionLastBidAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastBidAt",
                table: "Auctions",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Auctions",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastBidAt",
                table: "Auctions");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Auctions");
        }
    }
}
