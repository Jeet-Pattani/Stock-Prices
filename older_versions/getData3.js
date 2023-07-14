var axios = require('axios');

// An array of request configurations
var requests = [
    
//first 10 requests starts    

{  exchange: "NSE",
    tradingsymbol: "SBIN-EQ",
    symboltoken: "3045",
    },{
    exchange: "NSE",
    tradingsymbol: "RELIANCE-EQ",
    symboltoken: "2885",
  }, {
    exchange: "NSE",
    tradingsymbol: "TATACONSUM",
    symboltoken: "3432",
  },  {
    exchange: "NSE",
    tradingsymbol: "JSWSTEEL-EQ",
    symboltoken: "11723",
  },  {
    exchange: "NSE",
    tradingsymbol: "TATASTEEL-EQ",
    symboltoken: "3499",
  },  {
    exchange: "NSE",
    tradingsymbol: "NTPC-EQ",
    symboltoken: "11630",
  },  {
    exchange: "NSE",
    tradingsymbol: "POWERGRID-EQ",
    symboltoken: "14977",
  },  {
    exchange: "NSE",
    tradingsymbol: "BHARTIARTL-EQ",
    symboltoken: "10604",
  },  {
    exchange: "NSE",
    tradingsymbol: "BAJAFINSV-EQ",
    symboltoken: "16675",
  },  {
    exchange: "NSE",
    tradingsymbol: "BAJFINANCE-EQ",
    symboltoken: "317",
  },  


//first 10 requests ends   
//second 10 request starts

{
    exchange: "NSE",
    tradingsymbol: "HEROMOTOCO-EQ",
    symboltoken: "1348",
  },  
  {
    exchange: "NSE",
    tradingsymbol: "HDFCBANK-EQ",
    symboltoken: "1333",
  },
  {
    exchange: "NSE",
    tradingsymbol: "KOTAKBANK-EQ",
    symboltoken: "1922",
  },
  {
    exchange: "NSE",
    tradingsymbol: "TCS-EQ",
    symboltoken: "11536",
  },
  {
    exchange: "NSE",
    tradingsymbol: "INFY-EQ",
    symboltoken: "1594",
  },
  {
    exchange: "NSE",
    tradingsymbol: "HINDALCO-EQ",
    symboltoken: "1363",
  },
  {
    exchange: "NSE",
    tradingsymbol: "ADANIPOWER-EQ",
    symboltoken: "17388",
  },
  {
    exchange: "NSE",
    tradingsymbol: "ASIANPAINT-EQ",
    symboltoken: "236",
  },
  {
    exchange: "NSE",
    tradingsymbol: "APLAPOLLO-EQ",
    symboltoken: "25780",
  },
  {
    exchange: "NSE",
    tradingsymbol: "NESTLEIND-EQ",
    symboltoken: "17963",
  },
//second 10 requests ends

//third 10 requests starts
  {
    exchange: "NSE",
    tradingsymbol: "ITC-EQ",
    symboltoken: "1660",
  },
  {
    exchange: "NSE",
    tradingsymbol: "ONGC-EQ",
    symboltoken: "2475",
  },

  {
    exchange: "NSE",
    tradingsymbol: "SUNPHARMA-EQ",
    symboltoken: "3351",
  },
  {
    exchange: "NSE",
    tradingsymbol: "GRASIM-EQ",
    symboltoken: "1232",
  },
  {
    exchange: "NSE",
    tradingsymbol: "DIVISLAB-EQ",
    symboltoken: "10940",
  },
  {
    exchange: "NSE",
    tradingsymbol: "DRREDDY-EQ",
    symboltoken: "881",
  },

  {
    exchange: "NSE",
    tradingsymbol: "HCLTECH-EQ",
    symboltoken: "7229",
  },{
    exchange: "NSE",
    tradingsymbol: "WIPRO-EQ",
    symboltoken: "3787",
  },{
    exchange: "NSE",
    tradingsymbol: "BRITANNIA-EQ",
    symboltoken: "547",
  },{
    exchange: "NSE",
    tradingsymbol: "CIPLA-EQ",
    symboltoken: "694",
  },
//third 10 requests ends

//fourth 10 requests starts
{
    exchange: "NSE",
    tradingsymbol: "EICHERMOT-EQ",
    symboltoken: "910",
  },
{  exchange: "NSE",
    tradingsymbol: "MARUTI-EQ",
    symboltoken: "10999",
    },
    {  exchange: "NSE",
    tradingsymbol: "MAHINDCIE-EQ",
    symboltoken: "14937",
    },
    {  exchange: "NSE",
    tradingsymbol: "HINDMOTORS-EQ",
    symboltoken: "21676",
    },
    {  exchange: "NSE",
    tradingsymbol: "BPCL-EQ",
    symboltoken: "526",
    },
    {  exchange: "NSE",
    tradingsymbol: "COALINDIA-EQ",
    symboltoken: "20374",
    },
    {  exchange: "NSE",
    tradingsymbol: "TECHM-EQ",
    symboltoken: "13538",
    },
    {  exchange: "NSE",
    tradingsymbol: "HINDUNILVR-EQ",
    symboltoken: "1394",
    },
    {  exchange: "NSE",
    tradingsymbol: "ADANIGREEN-EQ",
    symboltoken: "3563",
    },
    {  exchange: "NSE",
    tradingsymbol: "ADANIENT-EQ",
    symboltoken: "25",
    },
//fourth 10 requests ends
//fifth 10 requests starts

    {  exchange: "NSE",
    tradingsymbol: "ZOMATO-EQ",
    symboltoken: "5097",
    },
    {  exchange: "NSE",
    tradingsymbol: "PIDILITIND-EQ",
    symboltoken: "2664",
    },
    {  exchange: "NSE",
    tradingsymbol: "HAVELLS-EQ",
    symboltoken: "9819",
    },
    {  exchange: "NSE",
    tradingsymbol: "DABUR-EQ",
    symboltoken: "772",
    },
    {  exchange: "NSE",
    tradingsymbol: "SHREECEM-EQ",
    symboltoken: "3103",
    },    {  exchange: "NSE",
    tradingsymbol: "IRCTC-EQ",
    symboltoken: "13611",
    },    {  exchange: "NSE",
    tradingsymbol: "LICI-EQ",
    symboltoken: "9480",
    },    {  exchange: "NSE",
    tradingsymbol: "MOTHERSON-EQ",
    symboltoken: "4204",
    },    {  exchange: "NSE",
    tradingsymbol: "BAJAJHLDNG-EQ",
    symboltoken: "305",
    },    {  exchange: "NSE",
    tradingsymbol: "BOSCHLTD-EQ",
    symboltoken: "2181",
    },
//fifth 10 requests ends
];

// Function to make a batch of requests
function makeRequestBatch(batch) {
  var configArray = batch.map((req) => ({
    method: 'post',
    url: 'https://apiconnect.angelbroking.com/order-service/rest/secure/angelbroking/order/v1/getLtpData',
    headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1Mjk3NzQiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwiaWF0IjoxNjg2NzE2MDMzLCJleHAiOjE2ODY4MDI0MzN9.8VRiaMYaRmY9n1p4UMky3GnALI0yYK4LYHvUF62G25a_q0rNb_2cjw-KRqvm_2tB9vb_McFr6dlUHtsLuwxKCg',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-UserType': 'USER',
        'X-SourceID': 'WEB',
        'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
        'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
        'X-MACAddress': 'MAC_ADDRESS',
        'X-PrivateKey': 'erZDHFHD'
      },
    data: JSON.stringify(req),
  }));

  return axios.all(configArray.map((config) => axios(config)))
    .then(axios.spread((...responses) => {
      // Process responses here
      responses.forEach((response) => {
        if (response.data.data && response.data.data.tradingsymbol) {
          console.log(JSON.stringify(response.data.data.tradingsymbol + " " + response.data.data.ltp));
        } else {
          console.log("Invalid response: " + JSON.stringify(response.data));
        }
      });
    }))
    .catch((error) => {
      console.log(error);
    });
}

// Function to make requests in batches with a delay between batches
function makeRequestsInBatches(requests, batchSize, delay) {
  var index = 0;

  function makeNextBatch() {
    var batch = requests.slice(index, index + batchSize);
    index += batchSize;

    makeRequestBatch(batch);

    if (index >= requests.length) {
      index = 0; // Reset index to start from the beginning
    }

    setTimeout(makeNextBatch, delay);
  }

  makeNextBatch();
}

// Start making requests in batches with a delay
makeRequestsInBatches(requests, 10, 1500); // 10 requests per batch, 1-second delay between batches
