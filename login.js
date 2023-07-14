const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// Create the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user for input
rl.question('Enter TOTP: ', (totp) => {
  const tempOTP = totp
  
const clientCode='A123456' //angel client code
const password = '1234'//4 digit pin
const apiKey = 'abcDEFh'

const data = JSON.stringify({
  clientcode: clientCode,
  password: password,
  totp: tempOTP,
});

const config = {
  method: 'post',
  url: 'https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-UserType': 'USER',
    'X-SourceID': 'WEB',
    'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
    'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
    'X-MACAddress': 'MAC_ADDRESS',
    'X-PrivateKey': apiKey,
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(response)
    const jwtToken = response.data.data.jwtToken;
    const refreshToken = response.data.data.refreshToken;
    const feedToken = response.data.data.feedToken;
    const configData = `
      module.exports = {
        jwtToken: '${jwtToken}',
        refreshToken: '${refreshToken}',
        feedToken: '${feedToken}',
        apiKey: '${apiKey}',
        clientCode:'${clientCode}',
      };
    `;

    fs.writeFile('config.js', configData, (err) => {
      if (err) throw err;
      console.log('Configuration file created!');
    });
  })
  .catch(function (error) {
    console.log(error);
  });
  // Close the readline interface
  rl.close();
});

