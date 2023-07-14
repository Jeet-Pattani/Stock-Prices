async function fetchTokenMapping() {
try {
const response = await fetch('http://localhost:3000/api/mappings');
const data = await response.json();
tokenMapping = data;// Map to store tokenID to tokenName mapping
} catch (error) {
console.log('Error fetching token mapping:', error);
}
}

// Call the fetchTokenMapping function to retrieve the mappings data
fetchTokenMapping();


// Function to fetch the latest data from the API endpoint
async function fetchLatestData() {
    try {
      const response = await fetch('http://localhost:3000/api/prices');
      const data = await response.json();
  
      const marqueeContainer = document.getElementById('marquee-container');
  
      // Clear the existing contents of the marquee container
      marqueeContainer.innerHTML = '';
  
      const indexContainer = document.getElementById('index-container');
  
      // Clear the existing contents of the index container
      indexContainer.innerHTML = '';
  
      // Iterate over the data and create stock items
      for (const tokenID in data) {
        if (Object.hasOwnProperty.call(data, tokenID)) {
          const item = data[tokenID];
  
          // Retrieve the token name from the tokenMapping
          const tokenName = tokenMapping[tokenID];
  
          // Create a span element for the stock item
          const stockItem = document.createElement('span');
          stockItem.classList.add('stocks');
  
          // Create and populate the span elements inside the stock item
          const nameSpan = document.createElement('span');
          nameSpan.classList.add('name');
          nameSpan.textContent = tokenName;
          stockItem.appendChild(nameSpan);
  
          const priceSpan = document.createElement('span');
          priceSpan.classList.add('price');
          priceSpan.textContent = item.ltp.toFixed(2);
          stockItem.appendChild(priceSpan);
  
          const pchngSpan = document.createElement('span');
          pchngSpan.classList.add('pchng');
          pchngSpan.textContent = `(${item.percentChange.toFixed(2)}%)`;
          stockItem.appendChild(pchngSpan);
  
          const symbolSpan = document.createElement('span');
          symbolSpan.classList.add('symbol');
          const symbolIcon = document.createElement('i');
          symbolIcon.classList.add('fa-solid');
          if (item.percentChange > 0) {
            symbolIcon.classList.add('fa-caret-up');
            priceSpan.classList.add('lightGreen');
            pchngSpan.classList.add('lightGreen');
            symbolSpan.classList.add('lightGreen');
          } else if (item.percentChange < 0) {
            symbolIcon.classList.add('fa-caret-down');
            priceSpan.classList.add('lightRed');
            pchngSpan.classList.add('lightRed');
            symbolSpan.classList.add('lightRed');
          } else {
            symbolIcon.classList.add('fa-minus');
          }
          symbolSpan.appendChild(symbolIcon);
          stockItem.appendChild(symbolSpan);
  
          // Check if the tokenID is in the list of index card tokens
          const indexCardTokens = ['99919000', '26000', '99926009', '99926017', '99926013'];
          if (indexCardTokens.includes(tokenID)) {
            const indexCard = document.createElement('div');
            indexCard.classList.add('index-card');
  
            const inameDiv = document.createElement('div');
            inameDiv.classList.add('iname');
            inameDiv.textContent = tokenName;
            indexCard.appendChild(inameDiv);
  
            const data1Div = document.createElement('div');
            data1Div.classList.add('data1');
            const data2Div = document.createElement('div');
            data2Div.classList.add('data2');
            const ipriceSpan = document.createElement('span');
            ipriceSpan.classList.add('iprice');
            ipriceSpan.textContent = item.ltp.toFixed(2);
            data1Div.appendChild(ipriceSpan);
            const istatusSpan = document.createElement('span');
            istatusSpan.classList.add('istatus');
            const istatusIcon = document.createElement('i');
            istatusIcon.classList.add('fa-solid');
            if (item.percentChange > 0) {
              istatusIcon.classList.add('fa-caret-up');
              data1Div.classList.add('darkGreen');
              data2Div.classList.add('darkGreen');
            } else if (item.percentChange < 0) {
              istatusIcon.classList.add('fa-caret-down');
              data1Div.classList.add('darkRed');
              data2Div.classList.add('darkRed');
            } else {
              istatusIcon.classList.add('fa-minus');
            }
            istatusSpan.appendChild(istatusIcon);
            data1Div.appendChild(istatusSpan);
            indexCard.appendChild(data1Div);
  
            const ichngSpan = document.createElement('span');
            ichngSpan.classList.add('ichng');
            ichngSpan.textContent = item.change;
            data2Div.appendChild(ichngSpan);
            const iperSpan = document.createElement('span');
            iperSpan.classList.add('iper');
            iperSpan.textContent = `(${item.percentChange}%)`;
            data2Div.appendChild(iperSpan);
            indexCard.appendChild(data1Div);
            indexCard.appendChild(data2Div);
  
            // Append the index card to the index container
            indexContainer.appendChild(indexCard);
          } else {
            // Append the stock item to the marquee container
            marqueeContainer.appendChild(stockItem);
          }
        }
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  }
  

// Call the fetchLatestData function to initially populate the marquee container
fetchLatestData();

// Fetch the latest data every 5 seconds
setInterval(fetchLatestData, 2e3);
