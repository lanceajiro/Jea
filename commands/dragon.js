const axios = require('axios');

module.exports = {
    jea: {
        name: 'dragon',
        aliases: ['dragonball'],
        description: 'Get a dragon ball cover with the given text.',
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

            const url = `https://deku-rest-api.replit.app/maker?type=ephoto&url=https://ephoto360.com/tao-hieu-ung-chu-phong-cach-dragon-ball-truc-tuyen-1000.html&q=${encodeURIComponent(text)}`;

            const response = await axios.get(url);
            const { data } = response.data;

            if (data.status && data.image) {
                await bot.sendPhoto(chatId, data.image);
            } else {
                await bot.sendMessage(chatId, "Failed to generate ephoto. Please try again later.");
            }
        } catch (error) {
            console.error(error);
            await bot.sendMessage(chatId, "An error occurred while processing your request.");
        }
    }
};
