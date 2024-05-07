const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    jea: {
        name: 'pinterest',
        description: 'Search and share Pinterest images',
        author: 'Shinpei/Hazeyy',
        usage: ['[search query]', 'Search for images on Pinterest'],
        category: 'media',
    },
    execute: async function ({ bot, chatId, args }) {
        try {
            let searchQuery = args.join(' ');

            if (!searchQuery) {
                bot.sendMessage(chatId, '🤖 Please send a name to proceed to search in Pinterest.').then(() => {
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
            bot.sendMessage(chatId, '🚫 An error occurred while fetching data from Pinterest API.');
        }
    }
};

async function searchAndSendImages(bot, chatId, searchQuery) {
    try {
        bot.sendMessage(chatId, '🕟 Searching on Pinterest, please wait...').then(async () => {
            const response = await axios.get(`https://hazee-social-downloader-9080f854bdab.herokuapp.com/pinterest?search=${searchQuery}`);
            const data = response.data;

            if (data.error) {
                bot.sendMessage(chatId, data.error);
                return;
            }

            const media = [];
            const storedPath = [];

            for (let i = 0; i < Math.min(data.count, 10); i++) {
                const imagePath = path.join(__dirname, 'cache', `${Math.floor(Math.random() * 99999999)}.jpg`);
                const pic = await axios.get(data.data[i], { responseType: 'arraybuffer' });
                await fs.promises.writeFile(imagePath, pic.data);
                storedPath.push(imagePath);
                media.push({ type: 'photo', media: fs.createReadStream(imagePath) });
            }

            await bot.sendMessage(chatId, `🤖 Pinterest Search Results\n\n🖋️ Search Query: '${searchQuery}'\n\n» Result Count: ${media.length} - ${data.count} «`);
            await bot.sendMediaGroup(chatId, media);

            // Delete stored images after sending
            await Promise.all(storedPath.map(imagePath => fs.promises.unlink(imagePath)));
        });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, '🚫 An error occurred while fetching data from Pinterest API.');
    }
}
