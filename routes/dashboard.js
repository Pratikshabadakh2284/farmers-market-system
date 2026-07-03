const express = require("express");
const router = express.Router();

const { connectDB } = require("../db/database");

router.get("/", async (req, res) => {

    try {

        const pool = await connectDB();

        const vendors = await pool.request().query(`
            SELECT COUNT(*) AS Total
            FROM Vendors
        `);

        const stalls = await pool.request().query(`
            SELECT COUNT(*) AS Total
            FROM Stalls
        `);

        const occupied = await pool.request().query(`
            SELECT COUNT(*) AS Total
            FROM Stalls
            WHERE Status='Occupied'
        `);

        const available = await pool.request().query(`
            SELECT COUNT(*) AS Total
            FROM Stalls
            WHERE Status='Available'
        `);

        const allocations = await pool.request().query(`
            SELECT COUNT(*) AS Total
            FROM Allocations
        `);

        const recent = await pool.request().query(`
            SELECT TOP 5
                V.VendorName,
                S.StallNumber,
                A.MarketDate
            FROM Allocations A
            INNER JOIN Vendors V
                ON A.VendorID = V.VendorID
            INNER JOIN Stalls S
                ON A.StallID = S.StallID
            ORDER BY A.AllocationID DESC
        `);

        res.json({

            vendors: vendors.recordset[0].Total,

            stalls: stalls.recordset[0].Total,

            occupied: occupied.recordset[0].Total,

            available: available.recordset[0].Total,

            allocations: allocations.recordset[0].Total,

            recent: recent.recordset

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

module.exports = router;