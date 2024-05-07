// pickupline.js

const axios = require('axios');

module.exports = {
    jea: {
        name: 'pickuplines',
        description: 'Get a random pickup line.',
        author: 'Shinpei',
        usage: '',
        category: 'Fun'
    },
    execute({ bot, chatId }) {
        axios.get('https://api.popcat.xyz/pickuplines')
            .then(response => {
                const data = response.data;
                const pickupLine = data.pickupline;
                const contributor = data.contributor;

                const message = `${pickupLine}
                `;

                bot.sendMessage(chatId, message);
            })
            .catch(error => {
                console.error('Error fetching pickup line:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the pickup line.');
            });
    }
};
