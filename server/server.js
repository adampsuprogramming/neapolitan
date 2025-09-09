const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true  
}));

app.get('/', (req, res) => {
    res.send('Server is running');
    res.end();
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(
    `The Server has been started on port ${PORT}`
));