const axios = require('axios');

module.exports = {
    jea: {
        name: 'meme',
        description: 'Get a random meme.',
        usage: [],
        author: 'Lance Ajiro',
        category: 'Fun' 
    },
    execute: async function ({ bot, chatId, args }) {
        try {
            const ris = await axios.get("https://meme-api.com/gimme");
            const image = ris.data.url;
            const title = ris.data.title;

            bot.sendPhoto(chatId, image, { caption: title });
        } catch (error) {
            console.error('Error fetching meme:', error);
            bot.sendMessage(chatId, 'Sorry, I couldn\'t fetch a meme at the moment. Please try again later.');
        }
    }
};
