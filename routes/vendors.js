const express = require("express");
const router = express.Router();

const { sql, connectDB } = require("../db/database");

/*
GET ALL VENDORS
*/
router.get("/", async (req, res) => {

    try {

        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT *
            FROM Vendors
            ORDER BY VendorID DESC
        `);

        res.json(result.recordset);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

module.exports = router;