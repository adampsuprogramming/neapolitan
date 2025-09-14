const express = require('express');
const pool = require('./db');
const cors = require('cors');
const app = express();
const borrowBaseRoutes = require('./routes/borrowBase');

app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true  
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
    res.end();
})

const PORT = process.env.PORT || 5000;

// Test route to ensure that DB connection is working
app.get('/tranches', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM loan_tranches');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB test tranches query failed)');
  }
});

// Route to retrieve borrowing base
app.use(borrowBaseRoutes);

app.listen(PORT,console.log(
    `The Server has been started on port ${PORT}`
));

module.exports = app;