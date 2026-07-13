const express = require("express");

const router = express.Router();

const {
    db
} = require("../db/database");


router.post("/login", (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;

        const user = db.prepare(`
            SELECT *
            FROM Users
            WHERE Username = ?
              AND Password = ?
        `).get(
            username,
            password
        );

        if (!user) {

            return res.status(401).json({
                message: "Invalid Username or Password"
            });

        }

        res.json({

            message: "Login Successful",

            username: user.Username,

            role: user.Role,

            vendorID: user.VendorID

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to login."
        });

    }

});


module.exports = router;