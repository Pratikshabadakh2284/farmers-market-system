const express = require("express");
const router = express.Router();
const { sql, connectDB } = require("../db/database");

/* SEARCH STALL */

router.get("/searchStall/:stall", async (req, res) => {

    try {

        const pool = await connectDB();

        const result = await pool.request()

            .input("search", sql.VarChar, "%" + req.params.stall + "%")

            .query(`
                SELECT *
                FROM Stalls
                WHERE StallNumber LIKE @search
            `);

        res.json(result.recordset);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

});


/* GET ALL STALLS */

router.get("/getAllStalls", async (req, res) => {
    try {

        const pool = await connectDB();

        const result = await pool.request()

            .query(`
                SELECT *
                FROM Stalls
                ORDER BY StallID DESC
            `);

        res.json(result.recordset);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

});


/* GET STALL BY ID */

router.get("/getStall/:id", async (req, res) => {
    try {

        const pool = await connectDB();

        const result = await pool.request()

            .input("StallID", sql.Int, req.params.id)

            .query(`
                SELECT *
                FROM Stalls
                WHERE StallID=@StallID
            `);

        res.json(result.recordset[0]);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

});


/* ADD STALL */

router.post("/addStall", async (req, res) => {
    try {
        const {
            StallNumber,
            LocationZone,
            RentalFee,
            Status
        } = req.body;

        if (!StallNumber || !LocationZone || !RentalFee || !Status) {
            return res.status(400).json({
                message: "Please fill all required fields."
            });
        }

        const pool = await connectDB();

        const check = await pool.request()
            .input("StallNumber", sql.VarChar, StallNumber)
            .query(`
                SELECT *
                FROM Stalls
                WHERE StallNumber = @StallNumber
            `);

        if (check.recordset.length > 0) {
            return res.status(400).json({
                message: "Stall Number already exists."
            });
        }

        await pool.request()
            .input("StallNumber", sql.VarChar, StallNumber)
            .input("LocationZone", sql.VarChar, LocationZone)
            .input("RentalFee", sql.Decimal(10, 2), RentalFee)
            .input("Status", sql.VarChar, Status)
            .query(`
                INSERT INTO Stalls
                (
                    StallNumber,
                    LocationZone,
                    RentalFee,
                    Status
                )
                VALUES
                (
                    @StallNumber,
                    @LocationZone,
                    @RentalFee,
                    @Status
                )
            `);

        res.status(201).json({
            message: "Stall Added Successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});


/* UPDATE STALL */

router.put("/updateStall/:id", async (req, res) => {

    try {

        const {

            StallNumber,
            LocationZone,
            RentalFee,
            Status

        } = req.body;

        const pool = await connectDB();

        await pool.request()

            .input("StallID", sql.Int, req.params.id)
            .input("StallNumber", sql.VarChar, StallNumber)
            .input("LocationZone", sql.VarChar, LocationZone)
            .input("RentalFee", sql.Decimal(10, 2), RentalFee)
            .input("Status", sql.VarChar, Status)

            .query(`

                UPDATE Stalls

                SET

                StallNumber=@StallNumber,
                LocationZone=@LocationZone,
                RentalFee=@RentalFee,
                Status=@Status

                WHERE StallID=@StallID

            `);

        res.json({

            message: "Stall Updated Successfully"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});


/* DELETE STALL */

router.delete("/deleteStall/:id", async (req, res) => {
    try {

        const pool = await connectDB();
        const allocation = await pool.request()
            .input("StallID", sql.Int, req.params.id)
            .query(`
        SELECT *
        FROM Allocations
        WHERE StallID = @StallID
    `);

        if (allocation.recordset.length > 0) {
            return res.status(400).json({
                message: "Cannot delete. Stall is allocated."
            });
        }
        await pool.request()

            .input("StallID", sql.Int, req.params.id)

            .query(`

                DELETE
                FROM Stalls
                WHERE StallID=@StallID

            `);

        res.json({

            message: "Stall Deleted Successfully"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

module.exports = router;