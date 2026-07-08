const express = require("express");
const router = express.Router();
const { sql, connectDB } = require("../db/database");

router.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        const pool = await connectDB();

        const result = await pool.request()
            .input("Username", sql.VarChar, username)
            .input("Password", sql.VarChar, password)
            .query(`
                SELECT *
                FROM Users
                WHERE Username = @Username
                AND Password = @Password
            `);

        if (result.recordset.length === 0) {

            return res.status(401).json({
                message: "Invalid Username or Password"
            });

        }

        const user = result.recordset[0];

        res.json({
            userID: user.UserID,
            username: user.Username,
            role: user.Role,
            vendorID: user.VendorID
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

module.exports = router;