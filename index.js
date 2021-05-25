const fs = require("fs");
const http = require("http");
const { randomInt } = require("crypto");

const credentials = fs.readFileSync("credentials.txt").toString();

const weatherbit = `http://api.weatherbit.io/v2.0/current?key=${credentials}&city=`;
const citybike = "http://api.citybik.es/v2/networks?city=";

const server = http.createServer(requestHandler);

function requestHandler(request, response) {

    if (request.url === "/") {

        const form = fs.createReadStream("html/index.html");
        form.pipe(response);

    } else if (request.url.startsWith("/search")) {

        let query = (new URL(request.url, `http://${request.headers.host}`)).searchParams;

        queryWeatherbit(response, query);

    }

}

function queryWeatherbit(response, query) {

    const url = `${weatherbit}${query.get("location")}`;

    http.get(url, weatherbitResponse => {

        let weatherbitDataJson = "";

        weatherbitResponse.on("data", data => weatherbitDataJson += data);
        weatherbitResponse.on("end", () => {

            if (weatherbitResponse.statusCode == 200) {

                let data = JSON.parse(weatherbitDataJson).data;

                if (data.length != 0) {

                    let city = data[0];

                    queryCityBike(response, city);

                } else
                    onBadInputOrResponse(response);


            } else
                onBadInputOrResponse(response);

        });

    });

}

function queryCityBike(response, city) {

    const url = `${citybike}${city.city_name}`;

    http.get(url, citybikeResponse => {

        let citybikeDataJson = "";

        citybikeResponse.on("data", data => citybikeDataJson += data);
        citybikeResponse.on("end", () => {

            if (citybikeResponse.statusCode == 200) {

                let networks = JSON.parse(citybikeDataJson).networks;
                let output = `<div style="width:49%; float:left; overflow-wrap:anywhere"> <b>Weather: </b> \n${JSON.stringify(city)}</div>`;
                output += `<div style="width:49%; float:right;"> <b> CityBike:</b> \n${JSON.stringify(networks[randomInt(networks.length)])}</div>`;

                response.writeHead(200, {
                    "Content-Type": 'text/html'
                });

                response.write(output);
                response.end();

            } else
                onBadInputOrResponse(response);

        });

    });

}

function onBadInputOrResponse(response) {

    response.write("Bad input or response, please try again!");
    response.end();

}

const port = 3000;
server.listen(port);
console.log(`Now Listening on Port ${port}`);