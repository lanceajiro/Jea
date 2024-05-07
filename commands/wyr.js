// wyr.js

const axios = require('axios');

module.exports = {
    jea: {
        name: 'wyr',
        description: 'Get a "Would You Rather?" scenario.',
        author: 'Shinpei',
        usage: '',
        category: 'Fun'
    },
    execute({ bot, chatId }) {
        const apiUrl = 'https://api.popcat.xyz/wyr';

        // Fetch a "Would You Rather?" scenario from the API
        axios.get(apiUrl)
            .then(response => {
                const option1 = response.data.ops1;
                const option2 = response.data.ops2;

                // Format the scenario
                const scenario = `Would you rather:\n\n${option1}\n\nOR\n\n${option2}`;

                // Send the scenario to the chat
                bot.sendMessage(chatId, scenario);
            })
            .catch(error => {
                console.error('Error fetching "Would You Rather?" scenario:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the scenario.');
            });
    }
};
