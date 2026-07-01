const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/database");

const vendorRoutes = require("./routes/vendors");
const stallRoutes = require("./routes/stalls");
const allocationRoutes = require("./routes/allocations");
const dashboardRoutes = require("./routes/dashboard");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/html", express.static("html"));
app.use("/js", express.static("js"));
app.use("/css", express.static("css"));

app.use("/api/vendors", vendorRoutes);
app.use("/api/stalls", stallRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("Farmers Market API Running");
});

const PORT = 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});