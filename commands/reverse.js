// reverse.js

const axios = require('axios');

module.exports = {
    jea: {
        name: 'reverse',
        description: 'Reverse a given text.',
        author: 'Shinpei',
        usage: '[text]',
        category: 'Utility'
    },
    execute({ bot, chatId, args }) {
        if (args.length === 0) {
            bot.sendMessage(chatId, 'Please provide a text to reverse.');
            return;
        }

        const text = encodeURIComponent(args.join(' '));

        // Send the request to the API
        axios.get(`https://api.popcat.xyz/reverse?text=${text}`)
            .then(response => {
                const reversedText = response.data.text;
                bot.sendMessage(chatId, `Reversed text: \n\n${reversedText}`);
            })
            .catch(error => {
                console.error('Error fetching reverse response:', error);
                bot.sendMessage(chatId, 'Sorry, something went wrong while fetching the reverse response.');
            });
    }
};
