// joke.js

const axios = require('axios');

module.exports = {
    jea: {
        name: 'joke',
        description: 'Get a random joke.',
        author: 'Shinpei',
        usage: '',
        category: 'Fun'
    },
    execute({ bot, chatId }) {
        const apiUrl = 'https://api.popcat.xyz/joke';

        // Fetch a random joke from the API
        axios.get(apiUrl)
            .then(response => {
                const joke = response.data.joke;

                // Send the joke to the chat
                bot.sendMessage(chatId, joke);
            })
            .catch(error => {
                console.error('Error fetching joke:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the joke.');
            });
    }
};
