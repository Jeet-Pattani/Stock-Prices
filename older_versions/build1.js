const fs = require('fs');
const { minify } = require('terser');

// Get the filename from command-line arguments
const filenameArg = process.argv[2];
const filename = filenameArg.split('=')[1];

if (!filename) {
  console.error('Filename not provided.');
  process.exit(1);
}

const inputFile = `${filename}.js`; // Replace with your input file name
const outputFile = `${filename}.min.js`; // Replace with your desired output file name

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
