const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./database/db');
const path = require('path');


const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware for parsing JSON requests
app.use(express.json());

// Define your routes
const userRouter = require('./routers/user');
const productRouter = require('./routers/file');
// Use the routers
app.use('/api/', userRouter);
app.use('/api/products/', productRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
