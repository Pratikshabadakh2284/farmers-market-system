require("dotenv").config();
const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;`
};

async function connectDB() {
    try {
        const pool = await sql.connect(config);
        console.log("SQL Server Connected Successfully");
        return pool;
    } catch (err) {
        console.error("Database Connection Failed");
        console.error(err);
    }
}

module.exports = {
    sql,
    connectDB
};