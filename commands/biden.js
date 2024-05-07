const axios = require('axios');
const fs = require('fs');
const { join } = require('path');

module.exports = {
    jea: {
        name: 'biden',
        description: 'Generate a "Biden pointing" meme with the specified text.',
        author: 'Shinpei',
        usage: '[text]',
        category: 'Fun'
    },
    execute({ bot, chatId, args, usages }) {
        const text = args.join(' ');

        if (!text) {
            return usages(bot);
        }

        // Define API URL with text parameter
        const apiUrl = `https://api.popcat.xyz/biden?text=${encodeURIComponent(text)}`;

        // Define cache folder path
        const cacheFolder = join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolder)) {
            fs.mkdirSync(cacheFolder);
        }

        // Define image file path
        const imagePath = join(cacheFolder, `biden_${Date.now()}.jpg`);

        // Fetch the meme image from the API
        axios({
            url: apiUrl,
            method: 'GET',
            responseType: 'stream'
        })
            .then(response => {
                // Save the image to cache
                response.data.pipe(fs.createWriteStream(imagePath))
                    .on('finish', () => {
                        // Send the meme image to the chat
                        bot.sendPhoto(chatId, fs.createReadStream(imagePath))
                            .then(() => {
                                // Delete the cached image after sending
                                fs.unlinkSync(imagePath);
                            })
                            .catch(error => {
                                console.error('Error sending photo:', error);
                                bot.sendMessage(chatId, 'An error occurred while sending the meme image.');
                            });
                    })
                    .on('error', error => {
                        console.error('Error downloading meme image:', error);
                        bot.sendMessage(chatId, 'An error occurred while downloading the meme image.');
                    });
            })
            .catch(error => {
                console.error('Error fetching meme image:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the meme image.');
            });
    }
};
