import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';


interface weatherData {
    hourly: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        apparent_temperature: number[];
        weathercode: number[];
        windspeed_10m: number[];
    }
}

export const main: APIGatewayProxyHandler = async (event) => {
    const longitude: string = event.queryStringParameters?.longitude; // -86.1581
    const latitude: string = event.queryStringParameters?.latitude; //39.7684
    const startdate: string = event.queryStringParameters?.start_date; //2024-10-29
    const enddate: string = event.queryStringParameters?.end_date;
    const timezone: string = event.queryStringParameters?.timezone; //America/Indianapolis

    if (!latitude || !longitude || !startdate || !enddate || !timezone) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Latitude, longitude, date, timezone must be provided" }),
        };
    }

    const url = 'https://api.open-meteo.com/v1/forecast?' + new URLSearchParams({
        'latitude': latitude,
        'longitude': longitude,
        'hourly': ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'weathercode', 'windspeed_10m'],
        'start_date': startdate,
        'end_date': enddate,
        'timezone': timezone,
        'temperature_unit': 'fahrenheit',
        'timeformat': 'iso8601',
        'windspeed_unit': 'mph',
        'precipitation_unit': 'inch'
    }).toString();

    try {
        const meteoResponse = await fetch(url);
        if (!meteoResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await meteoResponse.json() as weatherData;

        const response = {
            time: data.hourly.time,
            temperature: data.hourly.temperature_2m,
            humidity: data.hourly.relative_humidity_2m,
            apparentTemperature: data.hourly.apparent_temperature,
            weatherCode: data.hourly.weathercode,
            windSpeed: data.hourly.windspeed_10m,
        };

        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch weather data' }),
        };
    }
};

export default main;