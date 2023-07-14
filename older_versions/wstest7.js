const WebSocket = require('ws');

// WebSocket URL
const url = 'ws://smartapisocket.angelone.in/smart-stream';

// Authentication headers
const headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1Mjk3NzQiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwiaWF0IjoxNjg2ODA5ODY3LCJleHAiOjE2ODY4OTYyNjd9.IritSK8FL0aeFY5vjhEztqBtz2j0WmPvyFAwj-9VpbuVU9wggKD29xGG1DG0O7IdnzWAXwjcgH0fdeujmw8C6w',
  'x-api-key': 'erZDHFHD',
  'x-client-code': 'P529774',
  'x-feed-token': 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1Mjk3NzQiLCJpYXQiOjE2ODY4MDk4NjcsImV4cCI6MTY4Njg5NjI2N30.dyR6oxs98lDep8oQMr-pHYLo4wEpqpTevJnqj8cLfERBdkJgK_eWWT_j1QMbubfVIemIbnVLBaHakrSRpO8hFA'
};

// Create a WebSocket instance
const socket = new WebSocket(url, { headers });

// Handle WebSocket connection open
socket.on('open', () => {
  console.log('WebSocket connected');

  // Send a subscription request
  const subscriptionRequest = {
    action: 1,
    params: {
      mode: 1,
      tokenList: [
        {
          exchangeType: 1,
          tokens: ['26009']
        }
      ]
    }
  };

  socket.send(JSON.stringify(subscriptionRequest));
});

// Handle received messages from the WebSocket
socket.on('message', (message) => {
    const data = new Uint8Array(message);
  
    // Check if the message is a heartbeat response
    if (data.length === 4 && data[0] === 112 && data[1] === 111 && data[2] === 110 && data[3] === 103) {
      // Ignore heartbeat response
      return;
    }
  
    // Parse the received binary data based on the provided response contract
  
    // Example: Extract the Last Traded Price (LTP) and Token ID from the received data
    const ltpBytes = data.slice(43, 47);
    const ltpValue = ltpBytes.reduce((value, byte, index) => value + byte * Math.pow(256, index), 0);
    const ltp = ltpValue / 100;
  
    const tokenIDBytes = data.slice(2, 27);
    const tokenID = new TextDecoder().decode(tokenIDBytes);
  
    console.log(tokenID + ' ' + ltp);
  });
  
  

// Handle WebSocket connection close
socket.on('close', () => {
  console.log('WebSocket connection closed');
});

// Send heartbeat message every 30 seconds to keep the connection alive
setInterval(() => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send('ping');
  }
}, 1000);
