// initialize the application packages
const express = require("express");
const app = express();
const https = require("https");
const cheerio = require("cheerio");
const axios = require("axios");

// allow static url requests to the public folder and subfolders (for images, etc.)
app.use(express.static("public"));
// listen for requests - the main job of this code
// when a request comes in, process it using one of the app.get functions below
const listener = app.listen(process.env.PORT, function() {
  console.log("Express app is listening on port " + listener.address().port);
});

/* 
 * INDEX PAGE REQUEST
 * This is the basic default request for "/" 
 * This function sends back the index.html file
 */
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

/*
 * API GET REQUEST
 * This is a request for some simple API data. 
 * This function makes an API GET request and wait for an apiResponse
 * If successful, it sends back a response with the data to client.js
 * Any errors are logged to the _server_ console and a response 500 with error message is sent to client.js
 */
app.get("/weatherData", async function(request, response) {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=40.5142&longitude=-88.9906&hourly=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&forecast_days=1";
  try{
    const apiResponse = await axios.get(url);
    response.send(apiResponse.data);
  } catch (error){
    console.log(error.message);
    response.status(500).send(error.message);
  }
});

/*
 * ANOTHER SIMPLE GET REQUEST
 */
app.get("/yankeesData", async function(request, response) {
  const url = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/10";
  try{
    const apiResponse = await axios.get(url);
    response.send(apiResponse.data);
  } catch (error){
    console.log(error.message);
    response.status(500).send(error.message);
  }
});

/*
 * QUERY PARAMETERS EXAMPLE
 * This is an example of passing parameters from a client web page to an API.
 * The parameters are sent by the client as part of the URL (see this happen in client.js)
 * This server function extracts those parameters and attaches them to the 
 * outgoing URL request to the API server
 * This example also uses an API key named CALORIE_NINJA_KEY that is stored 
 * in process.env and added to the API request headers
 */
app.get("/calorieData", async function(request, response) {
  const userText = request.query.text;
  console.log(userText);            // (good place to debug)
  const url = "https://api.calorieninjas.com/v1/nutrition?query=" + userText;
  const options = {
    headers: {
      "X-Api-Key": process.env.CALORIE_NINJA_KEY,
      "Content-Type": 'application/json'
    }
  }
  try{
    const apiResponse = await axios.get(url, options);
    response.send(apiResponse.data);
  } catch (error){
    console.log(error.message);
    response.status(500).send(error.message);
  }
});

/*
 * WEB SCRAPING EXAMPLE
 * When only a standard web page with no API is available, it is possible to brute-force search
 * and collect the desired content from the page. This example builds a custom list of events
 * from an online calendar using a "regular expression" matcher.
 * Web scraping is fragile - changes to the published web page will often cause the scraping code to break.
 */
app.get("/calendarData", async function(request, response) {
  const url = "https://uhigh.tandem.co/index.php?search=Schedule&type=view&action=month&cur_year=2025&cur_month=03";
  try{
    // GET WEB PAGE //
    const apiResponse = await axios.get(url);                   // get a standard HTML web page
    const htmlText = apiResponse.data;                          // ...and covert it to HTML text
    //console.log(htmlText);                                    // (this would be a good place to debug)
    
    // SCRAPE CONTENTS //
    const regex = /(Schedule [A-E])[\s\S]*?(\d\d\d\d-\d\d-\d\d)/g;// create a regyular expression to search for
    let matchArray = [...htmlText.matchAll(regex)];             // ...and make an array of all the matches, cinluding subgroups
    //console.log(matchArray);                                  // (this would als0 be a good place to debug)
    
    // BUILD JSON RESPONSE //
    let events = [];                                           // create a blank array to hold events
    for (const match of matchArray){                           // iterate over each of the search matches
      let event = {"date":match[2], "event" : match[1]}        // create a JSON object from the key parts of the search match
      events.push(event);                                      // ...and add it to the array
    }
    
    response.send({"events":events});
  } catch (error){
    console.log(error.message);
    response.status(500).send(error.message);
  }
});

/*
 * API POST REQUEST
 * This is a request for some more complex API data
 * that uses an API key stored in .env
 * This function makes an API POST request with (optional) data, headers, and parameters.
 * If successful, it sends back a response with the data to client.js
 * Any errors are logged to the _server_ console and a response 500 with error message is sent to client.js
 */
app.get("/apiPost", async function(request, response) { 
  const url = "https://reqbin.com/echo/post/json";
  const data = {
    "Id": 101,
    "Name": "Some Person",
  };
  const options = {
    headers: {
      "Accept": 'application/json',
      "Content-Type": 'application/json'
    }  }
  try{
    const apiResponse = await axios.post(url, data, options);
    response.send(apiResponse.data);
  } catch (error){
    console.log(error.message);
    response.status(500).send(error.message);
  }
});



