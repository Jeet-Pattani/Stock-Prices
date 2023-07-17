const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// Create the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user for the password
rl.question('Enter password: ', (password) => {
  // Prompt the user for the TOTP
  rl.question('Enter TOTP: ', async (tempOTP) => {
    const clientCode = 'Your Angel Client Code';
    const apiKey = 'Your SmartAPI key';

    const data = {
      clientcode: clientCode,
      password: password,
      totp: tempOTP
    };

    try {
      const response = await axios.post(
        'https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-UserType': 'USER',
            'X-SourceID': 'WEB',
            'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
            'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
            'X-MACAddress': 'MAC_ADDRESS',
            'X-PrivateKey': apiKey
          }
        }
      );

      if (response.data.message === 'SUCCESS') {
        console.log('Login Successful...!');
        //console.log(response.data.message, '\n', response.data.data);
        console.log(response.data.message, '\n', "Auth Tokens Received");

        const { jwtToken, refreshToken, feedToken } = response.data.data;

        const configData = `module.exports = {
  jwtToken: '${jwtToken}',
  refreshToken: '${refreshToken}',
  feedToken: '${feedToken}',
  apiKey: '${apiKey}',
  clientCode: '${clientCode}'
};`;

        fs.writeFile('config.js', configData, (err) => {
          if (err) throw err;
          console.log('Configuration file created!');
        });
      } else {
        console.log(response.data.message, '\n', response.data.errorcode);
      }
    } catch (error) {
      console.log(error);
    }

    // Close the readline interface
    rl.close();
  });
});