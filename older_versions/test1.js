require("dotenv").config();

console.log(process.env.jwtToken);

const headers = {
    'Authorization': 'Bearer '+process.env.jwtToken,
    'x-api-key': 'erZDHFHD',
    'x-client-code': 'P529774',
    'x-feed-token': process.env.feedToken
  };


  console.log(headers);