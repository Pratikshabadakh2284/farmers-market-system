const { db } = require("./database");

function initialiseDatabase() {

    db.exec(`
        CREATE TABLE IF NOT EXISTS Vendors (
            VendorID INTEGER PRIMARY KEY AUTOINCREMENT,
            VendorName TEXT NOT NULL,
            Phone TEXT NOT NULL,
            Email TEXT NOT NULL,
            ProductCategory TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Stalls (
            StallID INTEGER PRIMARY KEY AUTOINCREMENT,
            StallNumber TEXT NOT NULL UNIQUE,
            LocationZone TEXT NOT NULL,
            RentalFee REAL NOT NULL,
            Status TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Allocations (
            AllocationID INTEGER PRIMARY KEY AUTOINCREMENT,
            VendorID INTEGER NOT NULL,
            StallID INTEGER NOT NULL,
            MarketDate TEXT NOT NULL,

            FOREIGN KEY (VendorID)
                REFERENCES Vendors(VendorID),

            FOREIGN KEY (StallID)
                REFERENCES Stalls(StallID)
        );

        CREATE TABLE IF NOT EXISTS Users (
            UserID INTEGER PRIMARY KEY AUTOINCREMENT,
            Username TEXT NOT NULL UNIQUE,
            Password TEXT NOT NULL,
            Role TEXT NOT NULL,
            VendorID INTEGER,

            FOREIGN KEY (VendorID)
                REFERENCES Vendors(VendorID)
        );
    `);

    const admin = db
        .prepare(`
            SELECT UserID
            FROM Users
            WHERE Username = ?
        `)
        .get("admin");

    if (!admin) {

        db.prepare(`
            INSERT INTO Users
            (
                Username,
                Password,
                Role,
                VendorID
            )
            VALUES (?, ?, ?, ?)
        `).run(
            "admin",
            "admin123",
            "Admin",
            null
        );

    }

    console.log("SQLite tables initialised successfully");
}

module.exports = {
    initialiseDatabase
};