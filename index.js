const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000

// Enable CORS for all routes
const corsOptions = {
  origin: ['https://localbazar.netlify.app'],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware for parsing JSON requests
app.use(express.json());

// Define your routes
const userRouter = require('./routers/user');
const productRouter = require('./routers/product');

// Use the routers
app.use('/api/', userRouter);
app.use('/api/products/', productRouter);

// Create HTTP server
const server = http.createServer(app);

// Attach WebSocket server to existing HTTP server
const io = socketIo(server, {
  cors: {
    origin: ['https://localbazar.netlify.app'],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});


// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle incoming events from the client
    socket.on('order', (data) => {
        console.log('Order received:', data);

        // Broadcast the order data to all connected clients (admin panel)
        io.emit('newOrder', data);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
