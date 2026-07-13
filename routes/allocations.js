const express = require("express");

const router = express.Router();

const {
    db
} = require("../db/database");


router.get("/vendors", (req, res) => {

    try {

        const vendors = db.prepare(`
            SELECT VendorID, VendorName
            FROM Vendors
            ORDER BY VendorName
        `).all();

        res.json(vendors);

    } catch (err) {

        res.status(500).json({
            message: "Unable to load vendors."
        });

    }

});


router.get("/availableStalls", (req, res) => {

    try {

        const stalls = db.prepare(`
            SELECT *
            FROM Stalls
            WHERE Status = 'Available'
            ORDER BY StallNumber
        `).all();

        res.json(stalls);

    } catch (err) {

        res.status(500).json({
            message: "Unable to load available stalls."
        });

    }

});


router.get("/getAllAllocations", (req, res) => {

    try {

        const allocations = db.prepare(`
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
        `).all();

        res.json(allocations);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to load allocations."
        });

    }

});


router.post("/addAllocation", (req, res) => {

    try {

        const {
            VendorID,
            StallID,
            MarketDate
        } = req.body;

        if (!VendorID || !StallID || !MarketDate) {

            return res.status(400).json({
                message:
                    "Vendor, stall and market date are required."
            });

        }

        const stall = db.prepare(`
            SELECT *
            FROM Stalls
            WHERE StallID = ?
        `).get(StallID);

        if (!stall) {

            return res.status(404).json({
                message: "Stall not found."
            });

        }

        if (stall.Status !== "Available") {

            return res.status(400).json({
                message: "Selected stall is not available."
            });

        }

        const vendorAllocation = db.prepare(`
            SELECT AllocationID
            FROM Allocations
            WHERE VendorID = ?
              AND MarketDate = ?
        `).get(
            VendorID,
            MarketDate
        );

        if (vendorAllocation) {

            return res.status(400).json({
                message:
                    "Vendor already has an allocation for this date."
            });

        }

        const createAllocation = db.transaction(() => {

            db.prepare(`
                INSERT INTO Allocations
                (
                    VendorID,
                    StallID,
                    MarketDate
                )
                VALUES (?, ?, ?)
            `).run(
                VendorID,
                StallID,
                MarketDate
            );

            db.prepare(`
                UPDATE Stalls
                SET Status = 'Occupied'
                WHERE StallID = ?
            `).run(StallID);

        });

        createAllocation();

        res.status(201).json({
            message: "Stall allocated successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to create allocation."
        });

    }

});


router.delete("/deleteAllocation/:id", (req, res) => {

    try {

        const allocation = db.prepare(`
            SELECT *
            FROM Allocations
            WHERE AllocationID = ?
        `).get(req.params.id);

        if (!allocation) {

            return res.status(404).json({
                message: "Allocation not found."
            });

        }

        const removeAllocation = db.transaction(() => {

            db.prepare(`
                DELETE FROM Allocations
                WHERE AllocationID = ?
            `).run(req.params.id);

            db.prepare(`
                UPDATE Stalls
                SET Status = 'Available'
                WHERE StallID = ?
            `).run(allocation.StallID);

        });

        removeAllocation();

        res.json({
            message: "Allocation Deleted Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to delete allocation."
        });

    }

});


router.get("/searchAllocation/:text", (req, res) => {

    try {

        const allocations = db.prepare(`
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

            WHERE V.VendorName LIKE ?

            ORDER BY A.AllocationID DESC
        `).all(
            `%${req.params.text}%`
        );

        res.json(allocations);

    } catch (err) {

        res.status(500).json({
            message: "Unable to search allocations."
        });

    }

});


module.exports = router;