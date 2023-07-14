const socket = new WebSocket('ws://localhost:8080');

// Handle WebSocket connection open
socket.onopen = () => {
  console.log('WebSocket connection established');

  // Send a message to the backend
  const message = 'Hello from the frontend!';
  socket.send(message);
};

// Handle received messages from the backend
socket.onmessage = (event) => {
  const responseData = JSON.parse(event.data);
  console.log('Received message from backend:', responseData);
};

// Handle WebSocket connection close
socket.onclose = () => {
  console.log('WebSocket connection closed');
};
