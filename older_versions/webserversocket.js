const WebSocket = require('ws');

// Create a WebSocket server instance
const wss = new WebSocket.Server({ port: 8090 });

// Handle WebSocket server connection
wss.on('connection', (ws) => {
  console.log('A new WebSocket client connected');

  // Handle messages received from the WebSocket client
  ws.on('message', (message) => {
    console.log('Message received from WebSocket client:', message);
    // Handle messages from WebSocket client if needed
  });
});

// Handle messages received from the parent process
process.on('message', (message) => {
  console.log('Message received from parent process:', message);
  
  // Send the message to the WebSocket client
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
});
