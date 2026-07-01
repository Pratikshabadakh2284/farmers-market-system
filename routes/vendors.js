const express = require("express");
const router = express.Router();
const { sql, connectDB } = require("../db/database");

/* SEARCH */
router.get("/searchVendor/:name", async (req, res) => {
    try {

        const pool = await connectDB();

        const result = await pool.request()
            .input("search", sql.VarChar, "%" + req.params.name + "%")
            .query(`
                SELECT *
                FROM Vendors
                WHERE VendorName LIKE @search
            `);

        res.json(result.recordset);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


/* GET ALL */

router.get("/getAllVendors", async (req, res) => {

    try {

        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT *
            FROM Vendors
            ORDER BY VendorID DESC
        `);

        res.json(result.recordset);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


/* GET BY ID */

router.get("/getVendor/:id", async (req, res) => {
    try {

        const pool = await connectDB();

        const result = await pool.request()

            .input("VendorID", sql.Int, req.params.id)

            .query(`
                SELECT *
                FROM Vendors
                WHERE VendorID=@VendorID
            `);

        res.json(result.recordset[0]);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


/* ADD */

router.post("/addVendor", async (req, res) => {
    try {

        const {
            VendorName,
            Phone,
            Email,
            ProductCategory
        } = req.body;

        const pool = await connectDB();

        await pool.request()

            .input("VendorName", sql.VarChar, VendorName)
            .input("Phone", sql.VarChar, Phone)
            .input("Email", sql.VarChar, Email)
            .input("ProductCategory", sql.VarChar, ProductCategory)

            .query(`

                INSERT INTO Vendors
                (
                    VendorName,
                    Phone,
                    Email,
                    ProductCategory
                )

                VALUES
                (
                    @VendorName,
                    @Phone,
                    @Email,
                    @ProductCategory
                )

            `);

        res.status(201).json({

            message: "Vendor Added Successfully"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});


/* UPDATE */

router.put("/updateVendor/:id", async (req, res) => {
    try {

        const {

            VendorName,
            Phone,
            Email,
            ProductCategory

        } = req.body;

        const pool = await connectDB();

        await pool.request()

            .input("VendorID", sql.Int, req.params.id)
            .input("VendorName", sql.VarChar, VendorName)
            .input("Phone", sql.VarChar, Phone)
            .input("Email", sql.VarChar, Email)
            .input("ProductCategory", sql.VarChar, ProductCategory)

            .query(`

                UPDATE Vendors

                SET

                VendorName=@VendorName,
                Phone=@Phone,
                Email=@Email,
                ProductCategory=@ProductCategory

                WHERE VendorID=@VendorID

            `);

        res.json({

            message: "Vendor Updated Successfully"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});


/* DELETE */

router.delete("/deleteVendor/:id", async (req, res) => {
    try {

        const pool = await connectDB();

        await pool.request()

            .input("VendorID", sql.Int, req.params.id)

            .query(`

                DELETE
                FROM Vendors
                WHERE VendorID=@VendorID

            `);

        res.json({

            message: "Vendor Deleted Successfully"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});


module.exports = router;