const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// WebSocket URL
const url = 'ws://smartapisocket.angelone.in/smart-stream';

// Authentication headers
const headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1Mjk3NzQiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwiaWF0IjoxNjg3MzU2NjcyLCJleHAiOjE2ODc0NDMwNzJ9.0SSHKRSgBORrU4NYCIoXRXCuBL2IwRS_g6RbKtfbvHDUjdnj9Jfr5rOmuTdQEc4xu3SiU3WJHObdkkXobAEodw',
  'x-api-key': 'erZDHFHD',
  'x-client-code': 'P529774',
  'x-feed-token': 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1Mjk3NzQiLCJpYXQiOjE2ODczNTY2NzIsImV4cCI6MTY4NzQ0MzA3Mn0.BAKHboMne9JYXf5wnpqZS1OTsTCCUdIla-2KXLT8zcOlNc0sp6pgiJHUaS5O-a6YvuGqCtcelpdKdjCjpYoXkw'
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


// Store the latest data received from the WebSocket
let latestData = {};

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
          tokens: ['26000','2885','3045','99926009','99926011','99926032','99926013','99926012','99926037','99926004','99926033','3432','11723','3499','11630','14977','10604','16675','317','1348','5258','1333','1922','11536','1594','1363','17388','236','3506','25780','17963','1660','2475','3351','1232','10940','881','7229','3787','547','694','910','10999','14937','21676','526','20374','13538','1394','3563','25','5097','2664','9819','772','3103','13611','9480','4204','305','2181']
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
  const closePriceBytes = data.slice(115, 122);
  const ltpValue = ltpBytes.reduce((value, byte, index) => value + byte * Math.pow(256, index), 0);
  const closePrice = closePriceBytes.reduce((value, byte, index) => value + byte * Math.pow(256, index), 0);
  const ltp = ltpValue / 100;
  const yesterdayPrice = closePrice / 100;
  const priceChange = parseFloat((ltp-yesterdayPrice).toFixed(2));
  const percentChange = parseFloat(((priceChange/ltp)*100).toFixed(2));

  const tokenIDBytes = data.slice(2, 27);
  //const decoder = new TextDecoder('utf-8');
  const tokenID = new TextDecoder().decode(tokenIDBytes).replace(/\u0000/g, '');
  const tokenName = tokenMapping[tokenID];

  // Create a JSON object with tokenID and ltp
  const jsonData = {
    tokenName: tokenName,
    ltp: ltp,
    yesterdayPrice:yesterdayPrice,
    change:priceChange,
    percentChange:percentChange,
  };

  // Store the latest data
  latestData = jsonData;

  // Display the JSON object
  console.log(JSON.stringify(jsonData));
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

// Define a GET endpoint to retrieve the latest data
app.get('/api/latest', (req, res) => {
  res.json(latestData);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
