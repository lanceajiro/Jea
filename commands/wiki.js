const axios = require('axios');
const fs = require('fs');
const path = require('path');

const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

module.exports = {
    jea: {
        name: 'wiki',
        description: "search in wiki",
        author: 'Lance Ajiro',
        category: 'study',
        usage: ['[query]'],
    },
    execute: async function ({ bot, chatId, args, usages }) {
        const searchTerm = args.join(' ');

        if (!searchTerm) {
            return usages(bot);
        }

        try {
            const response = await axios.get(`${WIKIPEDIA_API}${encodeURIComponent(searchTerm)}`);
            const { title, description, extract, thumbnail } = response.data;

            let replyMessage = `${title}\n- ${description}\n\n${extract}`;

            // Check if thumbnail exists and send it along with the reply
            if (thumbnail && thumbnail.source) {
                const imageUrl = thumbnail.source;
                const imageFileName = path.basename(imageUrl);
                const cacheFilePath = path.join(__dirname, 'cache', imageFileName);

                // Check if the image already exists in cache
                if (fs.existsSync(cacheFilePath)) {
                    // Send the message with the cached image
                    bot.sendPhoto(chatId, cacheFilePath, { caption: replyMessage });
                } else {
                    // Download the image and save it to cache
                    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
                    const cacheStream = fs.createWriteStream(cacheFilePath);
                    imageResponse.data.pipe(cacheStream);

                    cacheStream.on('finish', () => {
                        // Send the message with the cached image
                        bot.sendPhoto(chatId, cacheFilePath, { caption: replyMessage });
                        console.log('Image cached successfully:', cacheFilePath);
                    });

                    cacheStream.on('error', (err) => {
                        console.error('Error caching image:', err);
                        // Send the message without the image if caching fails
                        bot.sendMessage(chatId, replyMessage);
                    });
                }
            } else {
                // If no thumbnail, send only the reply message
                bot.sendMessage(chatId, replyMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            bot.sendMessage(chatId, 'An error occurred while searching on Wikipedia. Please try again later.');
        }
    },
};
