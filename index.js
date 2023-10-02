import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

const API_KEY = "fb7f4425cec8b8fb7202f8375a2c3d03";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// app.get("/", (req, res) => {
//     res.render("index.ejs");
// });

var API_URL = "https://api.open-meteo.com/v1/forecast?latitude=55.8651&longitude=-4.2576&hourly=temperature_2m&current_weather=true";
var city = "glasgow";
var geo = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + API_KEY;

app.get("/", async (req, res) => {
    try {
        var response0 = await axios.get(geo);
        var result = response0.data;
        var lat = result[0].lat;
        var lon = result[0].lon;
        var num1 = lat.toFixed(2);
        var num2 = lon.toFixed(2);
        var anotherMainUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + num1 + "&lon=" + num2 + "&appid=" + API_KEY;
        console.log(anotherMainUrl);
        var response = await axios.get(anotherMainUrl);
        var kelvin = response.data.main.temp;

        var celcius = Math.floor(kelvin - 273.15);
        var Fahrenheit = Math.floor(((kelvin - 273.15) * (9 / 5)) + 32);
        res.render("index.ejs", { cel: celcius, fah: Fahrenheit });
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            error: error.message,
        });
    }
});

app.post("/city", async (req, res) => {
    try {
        console.log(req.body.city);
        var userInput = req.body.city;
        console.log(userInput);
        geo = "http://api.openweathermap.org/geo/1.0/direct?q=" + req.body.city + "&appid=" + API_KEY;
        var response0 = await axios.get(geo);
        var result = response0.data;
        var lat = result[0].lat;
        var lon = result[0].lon;
        var num1 = lat.toFixed(2);
        var num2 = lon.toFixed(2);
        var anotherMainUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + num1 + "&lon=" + num2 + "&appid=" + API_KEY;
        var response = await axios.get(anotherMainUrl);
        console.log(response.data.main.temp);
        // userInput = response.data.name;
        // console.log(response.data.name);
        var kelvin = response.data.main.temp;
        var celcius = Math.floor(kelvin - 273.15);
        var Fahrenheit = Math.floor(((kelvin - 273.15) * (9 / 5)) + 32);
        res.render("other.ejs", { cel: celcius, fah: Fahrenheit, city: userInput });
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            error: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Successfully has started successfully.`);
});

