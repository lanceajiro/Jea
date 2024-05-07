const axios = require('axios');

module.exports = {
    jea: {
        name: 'mock',
        description: 'Mock text by alternating uppercase and lowercase letters.',
        author: 'Shinpei',
        usage: '[text]',
        category: 'Text'
    },
    execute({ bot, chatId, args, usages }) {
        const text = args.join(' ');

        if (!text) return usages(bot);

        // Define API URL with text parameter
        const apiUrl = `https://api.popcat.xyz/mock?text=${encodeURIComponent(text)}`;

        // Fetch the mocked text from the API
        axios.get(apiUrl)
            .then(response => {
                const mockedText = response.data.text;

                // Send the mocked text to the chat
                bot.sendMessage(chatId, mockedText);
            })
            .catch(error => {
                console.error('Error mocking text:', error);
                bot.sendMessage(chatId, 'An error occurred while mocking the text.');
            });
    }
};
