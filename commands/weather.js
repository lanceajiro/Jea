const axios = require('axios');

module.exports = {
    jea: {
        name: 'weather',
        description: 'Fetch weather information for a specific location.',
        author: 'Shinpei',
        usage: '[location]',
        category: 'Utility'
    },
    execute({ bot, chatId, args, usages }) {
        const location = args.join(' ');

        if (!location) {
            return usages(bot);
        }

        const apiUrl = `https://api.popcat.xyz/weather?q=${encodeURIComponent(location)}`;

        // Fetch weather information from the API
        axios.get(apiUrl)
            .then(response => {
                const weatherData = response.data[0];
                const currentWeather = weatherData.current;
                const locationInfo = weatherData.location;
                const forecast = weatherData.forecast;

                const message = `
Weather Forecast for ${locationInfo.name}:
🌡️ Current Temperature: ${currentWeather.temperature}°C (Feels like ${currentWeather.feelslike}°C)
🌤️ Sky: ${currentWeather.skytext}
💧 Humidity: ${currentWeather.humidity}%
💨 Wind: ${currentWeather.winddisplay}
📅 Date: ${currentWeather.date} ${currentWeather.observationtime}
${forecast.map(day => `
${day.shortday} (${day.date}):
  🌡️ Low: ${day.low}°C
  🌡️ High: ${day.high}°C
  🌤️ Sky: ${day.skytextday}
  💧 Precipitation: ${day.precip}%
`).join('')}
`;

                // Send the weather information to the chat
                bot.sendMessage(chatId, message);
            })
            .catch(error => {
                console.error('Error fetching weather information:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the weather information.');
            });
    }
};
