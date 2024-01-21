const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./database/db');


const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware for parsing JSON requests
app.use(express.json());

// Define your routes
const userRouter = require('./routers/user');
const productRouter = require('./routers/product');

// Use the routers
try {
  app.use('/api/', userRouter);
  app.use('/api/products/', productRouter);
} catch(error) {
    console.log(error)
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
