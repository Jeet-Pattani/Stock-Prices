const express = require('express');
const WebSocket = require('ws');
require("dotenv").config();
const app = express();
const port = 3000;

// WebSocket URL
const url = 'ws://smartapisocket.angelone.in/smart-stream';

// Authentication headers
const headers = {
  'Authorization': 'Bearer '+process.env.jwtToken,
  'x-api-key': 'erZDHFHD',
  'x-client-code': 'P529774',
  'x-feed-token': process.env.feedToken
};

// Create a WebSocket instance
const socket = new WebSocket(url, { headers });

// Map to store tokenID to tokenName mapping
const tokenMapping = {
  '26000': 'NIFTY-50',
  '99926009': 'NIFTY BANK',
  '99926011': 'NIFTY MIDCAP 100',
  '99926032': 'NIFTY SMALLCAP 100',
  '99926013':'NIFTY NEXT 50',
  '99926037':'NIFTY FINANCIAL SERVICES',
  '99926012':'NIFTY 100',
  '99926033':'NIFTY 200',
  '99926004':'NIFTY 500',
  '99919000':'SENSEX',
  '2885': 'RELIANCE',
  '3045': 'SBIN',
  '3432':'TATACONSUM',
  '11723':'JSWSTEEL',
  '3499':'TATASTEEL',
  '11630':'NTPC',
  '14977':'POWERGRID',
  '10604':'BHARTIARTL',
  '16675':'BAJAFINSV',
  '317':'BAJFINANCE',
  '1348':'HEROMOTOCO',
  '5258':'INDUSINDBK',
  '1333':'HDFCBANK',
  '1922':'KOTAKBANK',
  '11536':'TCS',
  '1594':'INFY',
  '1363':'HINDALCO',
  '17388':'ADANIPOWER',
  '236':'ASIANPAINT',
  '3506':'TITAN',
  '25780':'APLAPOLLO',
  '17963':'NESTLEIND',
  '1660':'ITC',
  '2475':'ONGC',
  '3351':'SUNPHARMA',
  '1232':'GRASIM',
  '10940':'DIVISLAB',
  '881':'DRREDDY',
  '7229':'HCLTECH',
  '3787':'WIPRO',
  '547':'BRITANNIA',
  '694':'CIPLA',
  '910':'EICHERMOT',
  '10999':'MARUTI',
  '14937':'MAHINDCIE',
  '21676':'HINDMOTORS',
  '526':'BPCL',
  '20374':'COALINDIA',
  '13538':'TECHM',
  '1394':'HINDUNILVR',
  '3563':'ADANIGREEN',
  '25':'ADANIENT',
  '5097':'ZOMATO',
  '2664':'PIDILITIND',
  '9819':'HAVELLS',
  '772':'DABUR',
  '3103':'SHREECEM',
  '13611':'IRCTC',
  '9480':'LICI',
  '4204':'MOTHERSON',
  '305':'BAJAJHLDNG',
  '2181':'BOSCHLTD',
};
const tokenIDArray = Object.keys(tokenMapping);
socket.on('open', () => {
  //console.log('WebSocket connected');

   // Send a subscription request
   const subscriptionRequest = {
    //correlationID: '',
    action: 0,
    params: {
      mode: 2,
      tokenList: [
        {
          exchangeType: 1,
          tokens: tokenIDArray,
        },
        {
          exchangeType: 3,
          tokens: ['99919000'],
        }
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
  
    // Example: Extract the Last Traded Price (LTP) and Token ID from the received data
    const ltpBytes = data.slice(43, 47);
    const ltpValue = ltpBytes.reduce((value, byte, index) => value + byte * Math.pow(256, index), 0);
    const ltp = ltpValue / 100;
  
    const tokenIDBytes = data.slice(2, 27);
    const tokenID = new TextDecoder().decode(tokenIDBytes).replace(/\u0000/g, '');
    const tokenName = tokenMapping[tokenID];
  
    // Check if the instrument already exists in the latestData object
    if (latestData[tokenID]) {
      const previousLTP = latestData[tokenID].ltp;
      const changeLTP = ltp - previousLTP;
      const changePercentage = ((changeLTP/ltp)*100).toFixed(2);
  
      // Update the latestData object with the new LTP and change values
      latestData[tokenID].ltp = ltp;
      latestData[tokenID].prevltp = previousLTP;
      latestData[tokenID].chng = changeLTP.toFixed(2);
      latestData[tokenID].pc = changePercentage;
    } else {
      // Create a new entry in the latestData object
      latestData[tokenID] = {
        tokenName: tokenName,
        ltp: ltp,
        chg: 0,
        pc: 0.00, // No previous value for the first data received
      };
    }
  
    // Display the JSON object
    console.log(latestData[tokenID]);
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
}, 28000);

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Define a GET endpoint to retrieve the latest data for all instruments
app.get('/api/latest', (req, res) => {
  res.json(latestData);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
