const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Set();

const url = 'ws://smartapisocket.angelone.in/smart-stream';


const socket = new WebSocket(url);

const headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1Mjk3NzQiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwiaWF0IjoxNjg2ODA5ODY3LCJleHAiOjE2ODY4OTYyNjd9.IritSK8FL0aeFY5vjhEztqBtz2j0WmPvyFAwj-9VpbuVU9wggKD29xGG1DG0O7IdnzWAXwjcgH0fdeujmw8C6w',
  'x-api-key': 'erZDHFHD',
  'x-client-code': 'P529774',
  'x-feed-token': 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1Mjk3NzQiLCJpYXQiOjE2ODY4MDk4NjcsImV4cCI6MTY4Njg5NjI2N30.dyR6oxs98lDep8oQMr-pHYLo4wEpqpTevJnqj8cLfERBdkJgK_eWWT_j1QMbubfVIemIbnVLBaHakrSRpO8hFA'
};


socket.on('open', () => {
  console.log('WebSocket connected');

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

function readInt64(data, startIndex) {
  let value = BigInt(0);
  for (let i = 0; i < 8; i++) {
    if (data[startIndex + i] === undefined) {
      return BigInt(0);
    }
    value += BigInt(data[startIndex + i]) * BigInt(256 ** i);
  }
  return value;
}

function readInt32(data, startIndex) {
  let value = 0;
  for (let i = 0; i < 4; i++) {
    value += data[startIndex + i] * (256 ** i);
  }
  return value;
}

socket.on('message', (message) => {
  const data = new Uint8Array(message);

  const subscriptionMode = data[0];
  const exchangeType = data[1];
  const tokenIDBytes = data.slice(2, 27);
  const tokenID = new TextDecoder().decode(tokenIDBytes);
  const sequenceNumber = readInt64(data, 27);
  const exchangeTimestamp = readInt64(data, 35);
  const ltpValue = readInt32(data, 43);
  const ltp = ltpValue / 100;

  console.log(tokenID + ' ' + ltp);

  const jsonData = JSON.stringify({ tokenID, ltp });
  sendDataToClients(jsonData);
});

socket.on('close', () => {
  console.log('WebSocket connection closed');
});

socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clients.delete(ws);
  });
});

function sendDataToClients(data) {
  clients.forEach((client) => {
    client.send(data);
  });
}

setInterval(() => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send('ping');
  }
}, 3000);
