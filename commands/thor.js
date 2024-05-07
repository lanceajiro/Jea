const axios = require('axios');

module.exports = {
    jea: {
        name: 'thor',
        description: 'Generate an ephoto with two texts.',
        author: 'Shinpei/Deku Api',
        usage: ['[text1] | [text2]'],
        category: 'maker'
    },
    execute: async function ({ bot, chatId, args, usages }) {
        try {
            const [text1, text2] = args.join(' ').split('|').map(t => t.trim());

            if (!text1 || !text2) {
                return usages(bot);
            }

            const url = `https://deku-rest-api.replit.app/maker?type=ephoto&url=https://ephoto360.com/tao-hieu-ung-chu-phong-cach-logo-thor-984.html&q=${encodeURIComponent(text1)}&q2=${encodeURIComponent(text2)}`;

            const response = await axios.get(url);
            const { data } = response.data;

            if (data.status && data.image) {
                await bot.sendPhoto(chatId, data.image);
            } else {
                await bot.sendMessage(chatId, "Failed to generate the ephoto. Please try again later.");
            }
        } catch (error) {
            console.error(error);
            await bot.sendMessage(chatId, "An error occurred while processing your request.");
        }
    }
};
