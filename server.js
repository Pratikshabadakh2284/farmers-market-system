const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/database");

const vendorRoutes = require("./routes/vendors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/vendors", vendorRoutes);

app.get("/", (req, res) => {
    res.send("Farmers Market API Running");
});

const PORT = 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});