const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:8080');

// Handle websocket connection open
socket.onopen = () => {
  console.log('WebSocket connected');
};

// Handle received messages from the websocket
socket.onmessage = (event) => {
  const jsonString = event.data;

  // Parse the JSON string
  const jsonData = JSON.parse(jsonString);

  // Format and use the received data as needed
  console.log(jsonData.data);
};

// Handle websocket connection close
socket.onclose = () => {
  console.log('WebSocket connection closed');
};
