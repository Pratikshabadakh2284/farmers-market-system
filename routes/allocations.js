const express = require("express");
const router = express.Router();
const { sql, connectDB } = require("../db/database");

/* ===================================================
   GET ALL ALLOCATIONS
=================================================== */

router.get("/getAllAllocations", async (req, res) => {

    try {

        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT
                A.AllocationID,
                V.VendorName,
                S.StallNumber,
                S.LocationZone,
                A.MarketDate
            FROM Allocations A
            INNER JOIN Vendors V
                ON A.VendorID = V.VendorID
            INNER JOIN Stalls S
                ON A.StallID = S.StallID
            ORDER BY A.AllocationID DESC
        `);

        res.json(result.recordset);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


/* ===================================================
   LOAD VENDORS
=================================================== */

router.get("/vendors", async (req, res) => {

    try {

        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT VendorID, VendorName
            FROM Vendors
            ORDER BY VendorName
        `);

        res.json(result.recordset);

    }

    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


/* ===================================================
   LOAD AVAILABLE STALLS
=================================================== */

router.get("/availableStalls", async (req, res) => {

    try {

        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT
                StallID,
                StallNumber,
                LocationZone
            FROM Stalls
            WHERE Status='Available'
            ORDER BY StallNumber
        `);

        res.json(result.recordset);

    }

    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


/* ===================================================
   ADD ALLOCATION
=================================================== */

router.post("/addAllocation", async (req, res) => {

    try {

        const {

            VendorID,
            StallID,
            MarketDate

        } = req.body;

        const pool = await connectDB();

        // Check if stall is already allocated

        const check = await pool.request()

            .input("StallID", sql.Int, StallID)

            .query(`
                SELECT *
                FROM Allocations
                WHERE StallID=@StallID
            `);

        if (check.recordset.length > 0) {

            return res.status(400).json({

                message: "This stall is already allocated."

            });

        }

        // Insert Allocation

        await pool.request()

            .input("VendorID", sql.Int, VendorID)
            .input("StallID", sql.Int, StallID)
            .input("MarketDate", sql.Date, MarketDate)

            .query(`
                INSERT INTO Allocations
                (
                    VendorID,
                    StallID,
                    MarketDate
                )

                VALUES
                (
                    @VendorID,
                    @StallID,
                    @MarketDate
                )
            `);

        // Update Stall Status

        await pool.request()

            .input("StallID", sql.Int, StallID)

            .query(`
                UPDATE Stalls
                SET Status='Occupied'
                WHERE StallID=@StallID
            `);

        res.json({

            message: "Stall Allocated Successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});


/* ===================================================
   DELETE ALLOCATION
=================================================== */

router.delete("/deleteAllocation/:id", async (req, res) => {

    try {

        const pool = await connectDB();

        // Find Stall

        const stall = await pool.request()

            .input("AllocationID", sql.Int, req.params.id)

            .query(`
                SELECT StallID
                FROM Allocations
                WHERE AllocationID=@AllocationID
            `);

        if (stall.recordset.length === 0) {

            return res.status(404).json({

                message: "Allocation Not Found"

            });

        }

        const stallID = stall.recordset[0].StallID;

        // Delete Allocation

        await pool.request()

            .input("AllocationID", sql.Int, req.params.id)

            .query(`
                DELETE
                FROM Allocations
                WHERE AllocationID=@AllocationID
            `);

        // Make Stall Available Again

        await pool.request()

            .input("StallID", sql.Int, stallID)

            .query(`
                UPDATE Stalls
                SET Status='Available'
                WHERE StallID=@StallID
            `);

        res.json({

            message: "Allocation Deleted Successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});


/* ===================================================
   SEARCH ALLOCATION
=================================================== */

router.get("/searchAllocation/:vendor", async (req, res) => {

    try {

        const pool = await connectDB();

        const result = await pool.request()

            .input("search", sql.VarChar, "%" + req.params.vendor + "%")

            .query(`
                SELECT
                    A.AllocationID,
                    V.VendorName,
                    S.StallNumber,
                    S.LocationZone,
                    A.MarketDate
                FROM Allocations A
                INNER JOIN Vendors V
                    ON A.VendorID = V.VendorID
                INNER JOIN Stalls S
                    ON A.StallID = S.StallID
                WHERE V.VendorName LIKE @search
                ORDER BY A.AllocationID DESC
            `);

        res.json(result.recordset);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

module.exports = router;