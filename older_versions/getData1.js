var axios = require('axios');

var data = JSON.stringify({
  "exchange": "NSE",
  "tradingsymbol": "Nifty Next 50",
  "symboltoken": "99926013",
});

var data1 = JSON.stringify({
  "exchange": "NSE",
  "tradingsymbol": "Nifty Fin Service",
  "symboltoken": "99926037",
});


var config = {
  method: 'post',
  url: 'https://apiconnect.angelbroking.com/order-service/rest/secure/angelbroking/order/v1/getLtpData',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1Mjk3NzQiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwiaWF0IjoxNjg2ODA5ODY3LCJleHAiOjE2ODY4OTYyNjd9.IritSK8FL0aeFY5vjhEztqBtz2j0WmPvyFAwj-9VpbuVU9wggKD29xGG1DG0O7IdnzWAXwjcgH0fdeujmw8C6w',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-UserType': 'USER',
    'X-SourceID': 'WEB',
    'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
    'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
    'X-MACAddress': 'MAC_ADDRESS',
    'X-PrivateKey': 'erZDHFHD'
  },
};

axios.all([axios.post(config.url, data, { headers: config.headers }), axios.post(config.url, data1, { headers: config.headers })])
  .then(axios.spread(function (response1, response2) {
    console.log(JSON.stringify(response1.data.data.ltp));
    console.log(JSON.stringify(response2.data.data.ltp));
  }))
  .catch(function (error) {
    console.log(error);
  });
