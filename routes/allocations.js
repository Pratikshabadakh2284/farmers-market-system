const express = require("express");
const router = express.Router();
const { sql, connectDB } = require("../db/database");


// ==============================
// GET ALL ALLOCATIONS
// ==============================

router.get("/", async (req, res) => {

    try {

        const pool = await connectDB();

        const result = await pool.request()

        .query(`

        SELECT

        A.AllocationID,
        A.MarketDate,

        V.VendorID,
        V.VendorName,

        S.StallID,
        S.StallNumber,
        S.LocationZone

        FROM Allocations A

        INNER JOIN Vendors V
        ON A.VendorID = V.VendorID

        INNER JOIN Stalls S
        ON A.StallID = S.StallID

        ORDER BY A.MarketDate DESC

        `);

        res.json(result.recordset);

    }

    catch(err){

        res.status(500).json({
            message:err.message
        });

    }

});



// ==============================
// CREATE ALLOCATION
// ==============================

router.post("/", async (req,res)=>{

    try{

        const{

            VendorID,
            StallID,
            MarketDate

        }=req.body;

        const pool=await connectDB();

        // Check if stall already allocated for same date

        const check=await pool.request()

        .input("StallID",sql.Int,StallID)
        .input("MarketDate",sql.Date,MarketDate)

        .query(`

        SELECT *

        FROM Allocations

        WHERE StallID=@StallID

        AND MarketDate=@MarketDate

        `);

        if(check.recordset.length>0){

            return res.status(400).json({

                message:"This stall is already allocated on this date."

            });

        }


        await pool.request()

        .input("VendorID",sql.Int,VendorID)
        .input("StallID",sql.Int,StallID)
        .input("MarketDate",sql.Date,MarketDate)

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

        .input("StallID",sql.Int,StallID)

        .query(`

        UPDATE Stalls

        SET Status='Occupied'

        WHERE StallID=@StallID

        `);

        res.status(201).json({

            message:"Stall Allocated Successfully"

        });

    }

    catch(err){

        res.status(500).json({

            message:err.message

        });

    }

});




// ==============================
// DELETE ALLOCATION
// ==============================

router.delete("/:id", async(req,res)=>{

    try{

        const pool=await connectDB();

        // Find Stall

        const allocation=await pool.request()

        .input("AllocationID",sql.Int,req.params.id)

        .query(`

        SELECT StallID

        FROM Allocations

        WHERE AllocationID=@AllocationID

        `);

        if(allocation.recordset.length===0){

            return res.status(404).json({

                message:"Allocation not found"

            });

        }

        const stallID=allocation.recordset[0].StallID;


        // Delete Allocation

        await pool.request()

        .input("AllocationID",sql.Int,req.params.id)

        .query(`

        DELETE FROM Allocations

        WHERE AllocationID=@AllocationID

        `);


        // Free Stall

        await pool.request()

        .input("StallID",sql.Int,stallID)

        .query(`

        UPDATE Stalls

        SET Status='Available'

        WHERE StallID=@StallID

        `);


        res.json({

            message:"Allocation Deleted Successfully"

        });

    }

    catch(err){

        res.status(500).json({

            message:err.message

        });

    }

});

module.exports=router;