// this client.js script is run by the user's browser each time the page is loaded

exampleA();
exampleB();
exampleC();
// example D is called from a button click
exampleE();

async function exampleA(){
  document.getElementById("text1").innerHTML = "<h4>Example A</h4>This text was set on page load by the client script without a server call.";
}

async function exampleB(){
  const response = await fetch("/weatherData");
  const data = await response.json();
  console.log(data);
  const highTemp = Math.max(...data.hourly.temperature_2m);
  document.getElementById("text2").innerHTML = "<h4>Example B</h4>Today's high temp: " + highTemp;
}

async function exampleC(){
  const response = await fetch("/yankeesData");
  const data = await response.json();
  console.log(data);
  const nextGame = data.team.nextEvent[0].name;
  const date = new Date(data.team.nextEvent[0].date);
  document.getElementById("text3").innerHTML = "<h4>Example C</h4>Next Yankees game:<br>" + nextGame + ", " + date.toDateString();
}

async function exampleD(){
  let foodText = document.getElementById("foodInput").value;    // read user text from input box
  const response = await fetch("/calorieData?text="+foodText);  // add the user input with the label 'text' to the server query
  const data = await response.json();
  console.log(data);
  document.getElementById("text4").innerHTML = data.items[0].name + " calories: " + data.items[0].calories;
}

async function exampleE(){
  const response = await fetch("/calendarData");
  const data = await response.json();
  console.log(data);
  let output = "<h4>Example E</h4>";
  for (let i = 0; i < data.events.length; i++){
    output += data.events[i].event + " on " + data.events[i].date;
    output += "<br>";
  }
  document.getElementById("text5").innerHTML = output;  
}

















