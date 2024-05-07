const axios = require('axios');

module.exports = {
    jea: {
        name: 'lulcat',
        description: 'Generate a lulcat response based on the given text.',
        author: 'Shinpei',
        usage: '[text]',
        category: 'Fun'
    },
    execute({ bot, chatId, args, usages }) {
        const text = args.join(' ');

        if (!text) return usages(bot);

        const apiUrl = `https://api.popcat.xyz/lulcat?text=${encodeURIComponent(text)}`;

        // Fetch the lulcat response from the API
        axios.get(apiUrl)
            .then(response => {
                const lulcatText = response.data.text;

                // Send the lulcat response to the chat
                bot.sendMessage(chatId, lulcatText);
            })
            .catch(error => {
                console.error('Error fetching lulcat response:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the lulcat response.');
            });
    }
};
