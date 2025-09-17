const express = require("express");
const pool = require("./db");
const cors = require("cors");
const app = express();
const borrowBaseRoutes = require("./routes/borrowBase");
const facilityRoutes = require("./routes/facilityQuery");
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];
require("dotenv").config();


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
  res.end();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

const PORT = process.env.PORT || 5000;

// Test route to ensure that DB connection is working
app.get("/tranches", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM loan_tranches");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB test tranches query failed)");
  }
});

// Route to retrieve borrowing base
app.use(borrowBaseRoutes);
app.use(facilityRoutes);

app.listen(PORT, console.log(`The Server has been started on port ${PORT}`));

module.exports = app;
