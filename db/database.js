const Database = require("better-sqlite3");
const path = require("node:path");

const databasePath =
    process.env.DB_PATH ||
    path.join(__dirname, "farmers-market.db");

const db = new Database(databasePath);

db.pragma("foreign_keys = ON");

function connectDB() {
    console.log("SQLite Database Connected Successfully");
    return db;
}

module.exports = {
    db,
    connectDB
};