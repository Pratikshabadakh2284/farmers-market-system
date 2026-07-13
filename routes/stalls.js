const express = require("express");

const router = express.Router();

const {
    db
} = require("../db/database");


router.get("/searchStall/:stall", (req, res) => {

    try {

        const stalls = db.prepare(`
            SELECT *
            FROM Stalls
            WHERE StallNumber LIKE ?
        `).all(
            `%${req.params.stall}%`
        );

        res.json(stalls);

    } catch (err) {

        res.status(500).json({
            message: "Unable to search stalls."
        });

    }

});


router.get("/getAllStalls", (req, res) => {

    try {

        const stalls = db.prepare(`
            SELECT *
            FROM Stalls
            ORDER BY StallID DESC
        `).all();

        res.json(stalls);

    } catch (err) {

        res.status(500).json({
            message: "Unable to load stalls."
        });

    }

});


router.get("/getStall/:id", (req, res) => {

    try {

        const stall = db.prepare(`
            SELECT *
            FROM Stalls
            WHERE StallID = ?
        `).get(req.params.id);

        if (!stall) {

            return res.status(404).json(null);

        }

        res.json(stall);

    } catch (err) {

        res.status(500).json({
            message: "Unable to load stall."
        });

    }

});


router.post("/addStall", (req, res) => {

    try {

        const {
            StallNumber,
            LocationZone,
            RentalFee,
            Status
        } = req.body;

        const existingStall = db.prepare(`
            SELECT StallID
            FROM Stalls
            WHERE StallNumber = ?
        `).get(StallNumber);

        if (existingStall) {

            return res.status(400).json({
                message: "Stall Number already exists."
            });

        }

        db.prepare(`
            INSERT INTO Stalls
            (
                StallNumber,
                LocationZone,
                RentalFee,
                Status
            )
            VALUES (?, ?, ?, ?)
        `).run(
            StallNumber,
            LocationZone,
            RentalFee,
            Status
        );

        res.status(201).json({
            message: "Stall Added Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to add stall."
        });

    }

});


router.put("/updateStall/:id", (req, res) => {

    try {

        const {
            StallNumber,
            LocationZone,
            RentalFee,
            Status
        } = req.body;

        const duplicate = db.prepare(`
            SELECT StallID
            FROM Stalls
            WHERE StallNumber = ?
              AND StallID != ?
        `).get(
            StallNumber,
            req.params.id
        );

        if (duplicate) {

            return res.status(400).json({
                message: "Stall Number already exists."
            });

        }

        const result = db.prepare(`
            UPDATE Stalls

            SET
                StallNumber = ?,
                LocationZone = ?,
                RentalFee = ?,
                Status = ?

            WHERE StallID = ?
        `).run(
            StallNumber,
            LocationZone,
            RentalFee,
            Status,
            req.params.id
        );

        if (result.changes === 0) {

            return res.status(404).json({
                message: "Stall not found."
            });

        }

        res.json({
            message: "Stall Updated Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: "Unable to update stall."
        });

    }

});


router.delete("/deleteStall/:id", (req, res) => {

    try {

        const allocation = db.prepare(`
            SELECT AllocationID
            FROM Allocations
            WHERE StallID = ?
        `).get(req.params.id);

        if (allocation) {

            return res.status(400).json({
                message: "Cannot delete. Stall is allocated."
            });

        }

        const result = db.prepare(`
            DELETE FROM Stalls
            WHERE StallID = ?
        `).run(req.params.id);

        if (result.changes === 0) {

            return res.status(404).json({
                message: "Stall not found."
            });

        }

        res.json({
            message: "Stall Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: "Unable to delete stall."
        });

    }

});


module.exports = router;