const express = require("express");

const router = express.Router();

const {
    db
} = require("../db/database");


/* SEARCH VENDOR */

router.get("/searchVendor/:name", (req, res) => {

    try {

        const vendors = db.prepare(`
            SELECT *
            FROM Vendors
            WHERE VendorName LIKE ?
        `).all(
            `%${req.params.name}%`
        );

        res.json(vendors);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to search vendors."
        });

    }

});


/* GET ALL VENDORS */

router.get("/getAllVendors", (req, res) => {

    try {

        const vendors = db.prepare(`
            SELECT *
            FROM Vendors
            ORDER BY VendorID DESC
        `).all();

        res.json(vendors);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to load vendors."
        });

    }

});


/* GET VENDOR */

router.get("/getVendor/:id", (req, res) => {

    try {

        const vendor = db.prepare(`
            SELECT *
            FROM Vendors
            WHERE VendorID = ?
        `).get(req.params.id);

        if (!vendor) {

            return res.status(404).json(null);

        }

        res.json(vendor);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to load vendor."
        });

    }

});


/* ADD VENDOR */

router.post("/addVendor", (req, res) => {

    try {

        const {
            VendorName,
            Phone,
            Email,
            ProductCategory
        } = req.body;

        db.prepare(`
            INSERT INTO Vendors
            (
                VendorName,
                Phone,
                Email,
                ProductCategory
            )
            VALUES (?, ?, ?, ?)
        `).run(
            VendorName,
            Phone,
            Email,
            ProductCategory
        );

        res.status(201).json({
            message: "Vendor Added Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to add vendor."
        });

    }

});


/* UPDATE VENDOR */

router.put("/updateVendor/:id", (req, res) => {

    try {

        const {
            VendorName,
            Phone,
            Email,
            ProductCategory
        } = req.body;

        const result = db.prepare(`
            UPDATE Vendors

            SET
                VendorName = ?,
                Phone = ?,
                Email = ?,
                ProductCategory = ?

            WHERE VendorID = ?
        `).run(
            VendorName,
            Phone,
            Email,
            ProductCategory,
            req.params.id
        );

        if (result.changes === 0) {

            return res.status(404).json({
                message: "Vendor not found."
            });

        }

        res.json({
            message: "Vendor Updated Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to update vendor."
        });

    }

});


/* DELETE VENDOR */

router.delete("/deleteVendor/:id", (req, res) => {

    try {

        const allocation = db.prepare(`
            SELECT AllocationID
            FROM Allocations
            WHERE VendorID = ?
        `).get(req.params.id);

        if (allocation) {

            return res.status(400).json({
                message:
                    "Cannot delete vendor. Vendor has an active stall allocation."
            });

        }

        const result = db.prepare(`
            DELETE FROM Vendors
            WHERE VendorID = ?
        `).run(req.params.id);

        if (result.changes === 0) {

            return res.status(404).json({
                message: "Vendor not found."
            });

        }

        res.json({
            message: "Vendor Deleted Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to delete vendor."
        });

    }

});


module.exports = router;