const { spawn } = require('child_process');

// Spawn the child process for running `getpricesfromsmartapi.js`
const childProcess = spawn('node', ['wstest10.js']);

// Listen for data events from the child process
childProcess.stdout.on('data', (data) => {
  // Process the received data from `getpricesfromsmartapi.js`
  const receivedData = JSON.parse(data);

  // Use the received data as needed
  console.log(receivedData);
});

// Handle any errors from the child process
childProcess.stderr.on('data', (error) => {
  console.error(`Error: ${error}`);
});

// Handle the child process exit event
childProcess.on('exit', (code) => {
  console.log(`Child process exited with code ${code}`);
});
