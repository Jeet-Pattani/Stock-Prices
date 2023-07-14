//Working Code which fetches prices of reliance, sbi, and nifty but without naming labels

const WebSocket = require('ws');

// WebSocket URL
const url = 'ws://smartapisocket.angelone.in/smart-stream';

// Authentication headers
const headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1Mjk3NzQiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwiaWF0IjoxNjg2OTEyNDM0LCJleHAiOjE2ODY5OTg4MzR9.XN8pRGHK3l6p0snsLnkMCrYAfJOYns5YFO263IWZpijfaSAvDAj2mCKF_tvrOnlUsJK88ypxViJxeERMMM_F_g',
  'x-api-key': 'Q906QkvT',
  'x-client-code': 'P529774',
  'x-feed-token': 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1Mjk3NzQiLCJpYXQiOjE2ODY5MTI0MzQsImV4cCI6MTY4Njk5ODgzNH0.yjLvriqA9sTyLCwniq_sU8FHT0yQ20djRGOSVTtLFWheKSAjGOsMiYMNVkRlc1SUx-ynkKdX_eoybamVI7u1ow'
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
  '11723':'JSWSTEEL-EQ',
  '3499':'TATASTEEL-EQ',
  '11630':'NTPC-EQ',
  '14977':'POWERGRID-EQ',
  '10604':'BHARTIARTL-EQ',
  '16675':'BAJAFINSV-EQ',
  '317':'BAJFINANCE-EQ',
  '1348':'HEROMOTOCO-EQ',
  '5258':'INDUSINDBK-EQ',
  '1333':'HDFCBANK-EQ',
  '1922':'KOTAKBANK-EQ',
  '11536':'TCS-EQ',
  '1594':'INFY-EQ',
  '1363':'HINDALCO-EQ',
  '17388':'ADANIPOWER-EQ',
  '236':'ASIANPAINT-EQ',
  '3506':'TITAN-EQ',
  '25780':'APLAPOLLO-EQ',
  '17963':'NESTLEIND-EQ',
  '1660':'ITC-EQ',
  '2475':'ONGC-EQ',
  '3351':'SUNPHARMA-EQ',
  '1232':'GRASIM-EQ',
  '1094':'DIVISLAB-EQ',
  '881':'DRREDDY-EQ',
  '7229':'HCLTECH-EQ',
  '3787':'WIPRO-EQ',
  '547':'BRITANNIA-EQ',
  '694':'CIPLA-EQ',
  '910':'EICHERMOT-EQ',
  '10999':'MARUTI-EQ',
  '14937':'MAHINDCIE-EQ',
  '21676':'HINDMOTORS-EQ',
  '526':'BPCL-EQ',
  '20374':'COALINDIA-EQ',
  '13538':'TECHM-EQ',
  '1394':'HINDUNILVR-EQ',
  '3563':'ADANIGREEN-EQ',
  '25':'ADANIENT-EQ',
  '5097':'ZOMATO-EQ',
  '2664':'PIDILITIND-EQ',
  '9819':'HAVELLS-EQ',
  '772':'DABUR-EQ',
  '3103':'SHREECEM-EQ',
  '13611':'IRCTC-EQ',
  '9480':'LICI-EQ',
  '4204':'MOTHERSON-EQ',
  '305':'BAJAJHLDNG-EQ',
  '2181':'BOSCHLTD-EQ',
};


// Handle WebSocket connection open
socket.on('open', () => {
  console.log('WebSocket connected');

  // Send a subscription request
  const subscriptionRequest = {
    //correlationID: '',
    action: 1,
    params: {
      mode: 1,
      tokenList: [
        /*{
          exchangeType: 1,
          tokens: ['26000','2885','3045','99926009','99926011','99926032','99926013','99926012','99926037','99926004','99926033','3432','11723','3499','11630','14977','10604','16675','317','1348','5258','1333','1922','11536','1594','1363','17388','236','3506','25780','17963','1660','2475','3351','1232','1094','881','7229','3787','547','694','910','10999','14937','21676','526','20374','13538','1394','3563','25','5097','2664','9819','772','3103','13611','9480','4204','305','2181']
        },*/

        {
          exchangeType: 3,
          tokens: ['99919000']
          
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
  const decoder = new TextDecoder('utf-8');
  const tokenID = new TextDecoder().decode(tokenIDBytes).replace(/\u0000/g, '');
  const tokenName = tokenMapping[tokenID];
  console.log(tokenName+" "+ltp)
  // Create a JSON object with tokenID and ltp
  /*const jsonData = {
    tokenID: tokenID,
    ltp: ltp
  };

  // Display the JSON object
  console.log(JSON.stringify(jsonData));*/
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
}, 29000);
