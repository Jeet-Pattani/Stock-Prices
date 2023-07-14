const express = require('express');
const WebSocket = require('ws');
require("dotenv").config();
const app = express();
const port = 3000;

// WebSocket URL
const url = 'ws://smartapisocket.angelone.in/smart-stream';

// Authentication headers
const headers = {
  'Authorization': 'Bearer ' + process.env.jwtToken,
  'x-api-key': 'Q906QkvT',
  'x-client-code': 'P529774',
  'x-feed-token': process.env.feedToken
};

// Create a WebSocket instance
const socket = new WebSocket(url, { headers });

// Map to store tokenID to tokenName mapping
const tokenMapping = {
  '99926037': 'NIFTY FINANCIAL SERVICES',
};

const tokenIDArray = Object.keys(tokenMapping);

// Store the received data in an array
//let receivedData = [];

// Handle WebSocket connection open
socket.on('open', () => {
  //console.log('WebSocket connected');

  // Send a subscription request
  const subscriptionRequest = {
    //correlationID: '',
    action: 1,
    params: {
      mode: 2,
      tokenList: [
        {
          exchangeType: 1,
          tokens: ['99926037'],
        },
      ],
    },
  };

  socket.send(JSON.stringify(subscriptionRequest));
});

// Store the latest data for each instrument
const latestData = {};

// Handle received messages from the WebSocket
socket.on('message', (message) => {
  const data = new Uint8Array(message);

  // Check if the message is a heartbeat response
  if (data.length === 4 && data[0] === 112 && data[1] === 111 && data[2] === 110 && data[3] === 103) {
    // Ignore heartbeat response
    return;
  }

  // Parse the received binary data based on the provided response contract

  // Extract the Last Traded Price (LTP) and Token ID from the received data
  const ltpBytes = data.slice(43, 47);
  const closePriceBytes = data.slice(115, 122);
  const tokenIDBytes = data.slice(2, 27);
  const ltpValue = ltpBytes.reduce((value, byte, index) => value + byte * Math.pow(256, index), 0);
  const closePrice = closePriceBytes.reduce((value, byte, index) => value + byte * Math.pow(256, index), 0);
  const ltp = ltpValue / 100;
  const yesterdayPrice = closePrice / 100;
  const priceChange = parseFloat((ltp - yesterdayPrice).toFixed(2));
  const percentChange = parseFloat(((priceChange / ltp) * 100).toFixed(2));

  //  const decoder = new TextDecoder('utf-8');
  const tokenID = new TextDecoder().decode(tokenIDBytes).replace(/\u0000/g, ''); //To decode from Bytes and remove the null characters at the end of tokenID
  const tokenName = tokenMapping[tokenID];

  // Create a JSON object with tokenID and ltp
  const jsonData = {
    tokenName: tokenName,
    ltp: ltp,
    yesterdayPrice: yesterdayPrice,
    change: priceChange,
    percentChange: percentChange,
  };

  // Store the latest data for the instrument
  latestData[tokenID] = jsonData;
  //console.log(latestData)
  // Display the JSON object
  console.log(jsonData);
});

// Handle WebSocket connection close
socket.on('close', () => {
  console.log('WebSocket connection closed');
});

// Handle WebSocket errors
socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// Send heartbeat message every 30 seconds to keep the connection alive
setInterval(() => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send('ping');
  }
}, 29000);

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// a GET endpoint to retrieve the latest data for all instruments
app.get('/api/prices', (req, res) => {
  res.json(latestData);
});

// a GET endpoint to retrieve the latest tokenMapping for the instruments
app.get('/api/mappings', (req, res) => {
  res.json(tokenMapping);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});