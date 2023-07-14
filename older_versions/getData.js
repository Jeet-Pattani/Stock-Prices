var axios = require('axios');
var data = JSON.stringify({
  "exchange":"NSE",
  "tradingsymbol":"SBIN-EQ",
  "symboltoken":"3045"
});





var config = {
  method: 'post',
  url: 'https://apiconnect.angelbroking.com/order-service/rest/secure/angelbroking/order/v1/getLtpData',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlA1Mjk3NzQiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwiaWF0IjoxNjg2ODc5Mjk1LCJleHAiOjE2ODY5NjU2OTV9.qig_gko0JxuKfVrqGQXzgGQDT44qvFkhlB2QtXd4mWmrzdCLjxA64CMT2_AU_5s_IN7W3ch5qWIqnqVCtL3Tzw', 
    'Content-Type': 'application/json', 
    'Accept': 'application/json', 
    'X-UserType': 'USER', 
    'X-SourceID': 'WEB', 
    'X-ClientLocalIP': 'CLIENT_LOCAL_IP', 
    'X-ClientPublicIP': 'CLIENT_PUBLIC_IP', 
    'X-MACAddress': 'MAC_ADDRESS', 
    'X-PrivateKey': 'erZDHFHD'
  },
  data : data,
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});