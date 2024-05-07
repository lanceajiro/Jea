const axios = require('axios');
const fs = require('fs');
const { join } = require('path');

module.exports = {
    jea: {
        name: 'facts',
        description: 'Generate an image with the provided text.',
        author: 'Shinpei',
        usage: '[text]',
        category: 'Fun'
    },
    execute({ bot, args, chatId, usages }) {
        const text = args.join(' ');

        if (!text) {
            return usages(bot);
        }

        // Define API URL with text parameter
        const apiUrl = `https://api.popcat.xyz/facts?text=${text}`;

        // Define cache folder path
        const cacheFolder = join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolder)) {
            fs.mkdirSync(cacheFolder);
        }

        // Define image file path
        const imagePath = join(cacheFolder, `${Date.now()}_facts.png`);

        // Download the image from the API
        axios({
            url: apiUrl,
            method: 'GET',
            responseType: 'stream'
        })
            .then(response => {
                // Save the image to cache
                response.data.pipe(fs.createWriteStream(imagePath))
                    .on('finish', () => {
                        // Send the image to the chat
                        bot.sendPhoto(chatId, fs.createReadStream(imagePath))
                            .then(() => {
                                // Delete the cached image after sending
                                fs.unlinkSync(imagePath);
                            })
                            .catch(error => {
                                console.error('Error sending photo:', error);
                                bot.sendMessage(chatId, 'An error occurred while sending the image.');
                            });
                    })
                    .on('error', error => {
                        console.error('Error downloading image:', error);
                        bot.sendMessage(chatId, 'An error occurred while downloading the image.');
                    });
            })
            .catch(error => {
                console.error('Error fetching image:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the image.');
            });
    }
};
