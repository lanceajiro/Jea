const axios = require('axios');

module.exports = {
    jea: {
        name: 'naruto',
        description: 'Generate Naruto-style text effect.',
        author: 'Shinpei/Deku Api',
        usage: ['[text]'],
        category: 'maker'
    },
    execute: async function ({ bot, chatId, args, usages }) {
        try {
            const text = args.join(" ");
            if (!text) {
                return usages(bot);
            }

            const url = `https://deku-rest-api.replit.app/maker?type=textpro&url=https://textpro.me/create-naruto-logo-style-text-effect-online-1125.html&q=${encodeURIComponent(text)}`;

            const response = await axios.get(url);
            const { data } = response.data;

            if (data.status && data.image) {
                await bot.sendPhoto(chatId, data.image);
            } else {
                await bot.sendMessage(chatId, "Failed to generate the Naruto-style text effect. Please try again later.");
            }
        } catch (error) {
            console.error(error);
            await bot.sendMessage(chatId, "An error occurred while processing your request.");
        }
    }
};
