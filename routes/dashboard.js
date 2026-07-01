const express=require("express");

const router=express.Router();

const {connectDB}=require("../db/database");

router.get("/",async(req,res)=>{

const pool=await connectDB();

const vendors=await pool.request().query("SELECT COUNT(*) Total FROM Vendors");

const stalls=await pool.request().query("SELECT COUNT(*) Total FROM Stalls");

const occupied=await pool.request().query("SELECT COUNT(*) Total FROM Stalls WHERE Status='Occupied'");

const available=await pool.request().query("SELECT COUNT(*) Total FROM Stalls WHERE Status='Available'");

res.json({

vendors:vendors.recordset[0].Total,

stalls:stalls.recordset[0].Total,

occupied:occupied.recordset[0].Total,

available:available.recordset[0].Total

});

});

module.exports=router;