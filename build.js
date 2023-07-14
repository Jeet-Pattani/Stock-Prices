const fs = require('fs');
const { minify } = require('terser');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user for input
rl.question('Enter your the filename(Do Not write the extension!): ', (filename) => {
  //console.log(`Hello, ${filename}!`);
  const inputFile = `${filename}`+'.js'; // Replace with your input file name
const outputFile = `${filename}`+'.min.js'; // Replace with your desired output file name

fs.readFile(inputFile, 'utf8', (err, inputCode) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  const minifyOptions = {}; // Customize options if needed

  minify(inputCode, minifyOptions)
    .then((minifiedCode) => {
      fs.writeFile(outputFile, minifiedCode.code, (writeErr) => {
        if (writeErr) {
          console.error(`Error writing file: ${writeErr}`);
        } else {
          console.log(`Minified code saved to ${outputFile}`);
        }
      });
    })
    .catch((minifyErr) => {
      console.error(`Error during minification: ${minifyErr}`);
    });
});
  // Close the readline interface
  rl.close();
});


