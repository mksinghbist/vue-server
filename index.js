const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
require('dotenv').config();
require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000

// Enable CORS for all routes
const corsOptions = {
  origin: 'https://localbazar.netlify.app',
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

// Create a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// WebSocket connection handling
wss.on('connection', function connection(ws) {
  console.log('WebSocket client connected');

  // Event handler for incoming WebSocket messages
  ws.on('message', function incoming(message) {
    console.log('Received message:', message);

    // Handle the incoming message (e.g., broadcast to other clients)
    // Implement your custom logic here
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Event handler for WebSocket connection close
  ws.on('close', function close() {
    console.log('WebSocket client disconnected');
  });
});

// Attach WebSocket server to existing HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});
