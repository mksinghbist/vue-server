const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'https://localbazar.netlify.app',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const userRouter = require('./routers/user');
const productRouter = require('./routers/product');

app.use('/api/', userRouter);
app.use('/api/products/', productRouter);

const server = http.createServer(app);

// Attach WebSocket server to existing HTTP server
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:8080/',
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