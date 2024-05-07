const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    jea: {
        name: 'image',
        description: 'Search for images using Unsplash',
        author: 'Shinpei/Hazeyy',
        usage: '[query]',
        category: 'media',
    },
    execute: async function ({ bot, chatId, args }) {
        try {
            let searchQuery = args.join(' ');

            if (!searchQuery) {
                bot.sendMessage(chatId, 'Please send a name to proceed to search in Unsplash.').then(() => {
                    bot.once('message', async (msg) => {
                        searchQuery = msg.text.trim();

                        if (!searchQuery) {
                            bot.sendMessage(chatId, '🚫 Invalid search query. Please provide a valid search query.');
                            return;
                        }

                        await searchAndSendImages(bot, chatId, searchQuery);
                    });
                });
            } else {
                await searchAndSendImages(bot, chatId, searchQuery);
            }
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, "🚫 An error occurred while fetching data.");
        }
    }
};

async function searchAndSendImages(bot, chatId, searchQuery) {
    try {
        await bot.sendMessage(chatId, '🕟 Searching for images on Unsplash, please wait...');

        const response = await axios.get(`https://api.unsplash.com/search/photos?page=1&per_page=10&query=${searchQuery}&client_id=oWmBq0kLICkR_5Sp7m5xcLTAdkNtEcRG7zrd55ZX6oQ`);

        const data = response.data;
        const results = data.results.map(result => result.urls.regular);

        const media = [];
        const storedPath = [];
        for (let i = 0; i < Math.min(results.length, 10); i++) {
            const imagePath = path.join(__dirname, 'cache', `unsplash_${i + 1}.jpg`);
            const imageResponse = await axios.get(results[i], { responseType: 'arraybuffer' });
            fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'utf-8'));
            storedPath.push(imagePath);
            media.push({ type: 'photo', media: fs.createReadStream(imagePath) });
        }

        await bot.sendMessage(chatId, `🤖 Unsplash Image Search Results\n\n🖋️ Search Query: '${searchQuery}'\n\n» Result Count: ${media.length} «`);
        await bot.sendMediaGroup(chatId, media);

        // Delete stored images after sending
        storedPath.forEach(imagePath => fs.unlinkSync(imagePath));
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "🚫 An error occurred while fetching data.");
    }
}
