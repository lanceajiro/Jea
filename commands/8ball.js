// 8ball.js

const axios = require('axios');

module.exports = {
    jea: {
        name: '8ball',
        description: 'Ask the magic 8-ball a question.',
        author: 'Shinpei',
        usage: '',
        category: 'Fun'
    },
    execute({ bot, chatId }) {
        // Send the request to the API
        axios.get('https://api.popcat.xyz/8ball')
            .then(response => {
                const answer = response.data.answer;
                bot.sendMessage(chatId, `🎱 ${answer}`);
            })
            .catch(error => {
                console.error('Error fetching 8ball response:', error);
                bot.sendMessage(chatId, 'Sorry, something went wrong while fetching the 8ball response.');
            });
    }
};
