const express = require("express");

const router = express.Router();

const {
    db
} = require("../db/database");


router.get("/", (req, res) => {

    try {

        const vendors = db
            .prepare(`
                SELECT COUNT(*) AS count
                FROM Vendors
            `)
            .get().count;

        const stalls = db
            .prepare(`
                SELECT COUNT(*) AS count
                FROM Stalls
            `)
            .get().count;

        const available = db
            .prepare(`
                SELECT COUNT(*) AS count
                FROM Stalls
                WHERE Status = 'Available'
            `)
            .get().count;

        const occupied = db
            .prepare(`
                SELECT COUNT(*) AS count
                FROM Stalls
                WHERE Status = 'Occupied'
            `)
            .get().count;

        const allocations = db
            .prepare(`
                SELECT COUNT(*) AS count
                FROM Allocations
            `)
            .get().count;


        res.json({

            vendors,
            stalls,
            available,
            occupied,
            allocations

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to load dashboard."
        });

    }

});


module.exports = router;