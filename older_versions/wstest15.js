//Final File which works and provides the percentChange correctly. For further scope of improvement we need to store the live data of indices to show the chart on the frontend. Moreover, the data of the stocks as well as the indices should be stored separately in a file and after the market hours the websocket connection should be closed and only the stored file data should be served.
const express = require('express');
const WebSocket = require('ws');
//require("dotenv").config();
const config = require('./config');
const app = express();
const port = 3000;

// WebSocket URL
const url = 'ws://smartapisocket.angelone.in/smart-stream';

// Authentication headers
const headers = {
  'Authorization': 'Bearer '+config.jwtToken,
  'x-api-key': config.apiKey,
  'x-client-code': config.clientCode,
  'x-feed-token': config.feedToken,
};


// Create a WebSocket instance
const socket = new WebSocket(url, { headers });

// Map to store tokenID to tokenName mapping
const tokenMapping = {
    '99919000':'SENSEX',
    '26000': 'NIFTY 50',
    '99926009': 'NIFTY BANK',
    '99926017': 'INDIA VIX',
    '99926013':'NIFTY NEXT 50',
    /*'99926011',: 'NIFTY MIDCAP 100',
    '99926032',: 'NIFTY SMALLCAP 100',
    '99926037',:'NIFTY FINANCIAL SERVICES',
    '99926012',:'NIFTY 100',
    '99926033',:'NIFTY 200',
    '99926004',:'NIFTY 500',
    '99926011','NIFTY MIDCAP 100',
    */
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
          tokens: tokenIDArray,
        },
        {
          exchangeType: 3,
          tokens: ['99919000'],/*we need to send a different array for stocks/insturments of BSE as it is exchange type 3. Below are the different exchangeTypes according to the docs.
          */
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
  const priceChange = parseFloat((ltp-yesterdayPrice).toFixed(2));
  const percentChange = parseFloat(((priceChange/ltp)*100).toFixed(2));

//  const decoder = new TextDecoder('utf-8');
  const tokenID = new TextDecoder().decode(tokenIDBytes).replace(/\u0000/g, '');//To decode from Bytes and remove the null characters at the end of tokenID
  const tokenName = tokenMapping[tokenID];//retrieves token name for the corresponding tokenID from the tokenMapping
  // Create a JSON object with tokenID and ltp
  const jsonData = {
    tokenName: tokenName,
    ltp: ltp,
    yesterdayPrice:yesterdayPrice,
    change:priceChange,
    percentChange:percentChange,
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

// Send heartbeat message every 30 seconds to keep the connection alive
setInterval(() => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send('ping');
  }
}, 1000);

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