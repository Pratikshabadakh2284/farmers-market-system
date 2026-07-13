const express = require("express");
const cors = require("cors");
const { initialiseDatabase } = require("./db/initDatabase");
const { connectDB } = require("./db/database");

const vendorRoutes = require("./routes/vendors");
const stallRoutes = require("./routes/stalls");
const allocationRoutes = require("./routes/allocations");
const dashboardRoutes = require("./routes/dashboard");
const authRoutes = require("./routes/auth");

const app = express();


/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());


/* =========================
   STATIC FILES
========================= */

app.use("/html", express.static("html"));

app.use("/js", express.static("js"));

app.use("/css", express.static("css"));


/* =========================
   API ROUTES
========================= */

app.use("/api/vendors", vendorRoutes);

app.use("/api/stalls", stallRoutes);

app.use("/api/allocations", allocationRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/auth", authRoutes);


/* =========================
   LOGIN PAGE
========================= */

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/html/login.html");

});


/* =========================
   START SERVER
========================= */

//const PORT = 3000;

const PORT = process.env.PORT || 3000;

async function startServer() {

    connectDB();

    initialiseDatabase();

    app.listen(PORT, () => {

        console.log(
            `Server running on port ${PORT}`
        );

    });

}


/*
Only start the server when server.js
is executed directly.

Do not automatically start the server
when imported by automated tests.
*/

if (require.main === module) {

    startServer();

}


module.exports = app;