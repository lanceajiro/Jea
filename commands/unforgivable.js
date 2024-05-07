const axios = require('axios');
const fs = require('fs');
const { join } = require('path');

module.exports = {
    jea: {
        name: 'unforgivable',
        description: 'Generate an "unforgivable" meme with the provided text.',
        author: 'Shinpei',
        usage: '[text]',
        category: 'Fun'
    },
    execute({ bot, chatId, args, usages }) {
        const text = args.join('+');

        if (!text) {
            return usages(bot);
        }

        const cacheFolder = join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolder)) {
            fs.mkdirSync(cacheFolder);
        }

        const memePath = join(cacheFolder, `${text}.jpg`);

        // Check if meme is already cached
        if (fs.existsSync(memePath)) {
            sendMeme(bot, chatId, memePath);
        } else {
            axios.get(`https://api.popcat.xyz/unforgivable?text=${text}`, { responseType: 'arraybuffer' })
                .then(response => {
                    // Save the meme to the cache folder
                    fs.writeFileSync(memePath, Buffer.from(response.data, 'binary'));

                    // Send the meme
                    sendMeme(bot, chatId, memePath);
                })
                .catch(error => {
                    console.error('Error fetching meme:', error);
                    bot.sendMessage(chatId, 'An error occurred while generating the "unforgivable" meme.');
                });
        }
    }
};

function sendMeme(bot, chatId, memePath) {
    bot.sendPhoto(chatId, fs.createReadStream(memePath))
        .then(() => {
            // Delete the meme from cache after sending
            fs.unlinkSync(memePath);
        })
        .catch(error => {
            console.error('Error sending photo:', error);
            bot.sendMessage(chatId, 'An error occurred while sending the "unforgivable" meme.');
        });
}
