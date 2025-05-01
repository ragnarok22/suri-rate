const axios = require("axios");
const cheerio = require("cheerio");

(async () => {
  try {
    // Step 1: Fetch the HTML content
    const { data: html } = await axios.get("https://www.republicbanksr.com");

    // Step 2: Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Step 3: Locate the exchange rates table
    // Assuming the table has a unique identifier or class
    const forexTable = $("table.forex-rates"); // Replace with the actual selector

    // Extract table headers
    const headers = [];
    forexTable.find("thead tr th").each((i, elem) => {
      headers.push($(elem).text().trim());
    });

    // Extract table rows
    const rates = [];
    forexTable.find("tbody tr").each((i, row) => {
      const rowData = {};
      $(row)
        .find("td")
        .each((j, cell) => {
          rowData[headers[j]] = $(cell).text().trim();
        });
      rates.push(rowData);
    });

    console.log(rates);
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
  }
})();
