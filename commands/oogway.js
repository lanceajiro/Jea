const axios = require('axios');
const fs = require('fs');
const { join } = require('path');

module.exports = {
    jea: {
        name: 'oogway',
        description: 'Generate an image with Oogway from Kung Fu Panda with the provided text.',
        author: 'Shinepi',
        usage: '[text]',
        category: 'Fun'
    },
    execute({ bot, chatId, args, usages }) {
        const text = args.join('+');

        if (!text) {
            return usages(bot);
        }

        const apiUrl = `https://api.popcat.xyz/oogway?text=${text}`;

        // Define cache folder path
        const cacheFolder = join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolder)) {
            fs.mkdirSync(cacheFolder);
        }

        // Define image file path
        const imagePath = join(cacheFolder, 'oogway.jpg');

        // Download the Oogway image from the API
        axios({
            url: apiUrl,
            method: 'GET',
            responseType: 'stream'
        })
            .then(response => {
                // Save the image to cache
                response.data.pipe(fs.createWriteStream(imagePath))
                    .on('finish', () => {
                        // Send the Oogway image to the chat
                        bot.sendPhoto(chatId, fs.createReadStream(imagePath))
                            .then(() => {
                                // Delete the cached image after sending
                                fs.unlinkSync(imagePath);
                            })
                            .catch(error => {
                                console.error('Error sending photo:', error);
                                bot.sendMessage(chatId, 'An error occurred while sending the Oogway image.');
                            });
                    })
                    .on('error', error => {
                        console.error('Error downloading Oogway image:', error);
                        bot.sendMessage(chatId, 'An error occurred while downloading the Oogway image.');
                    });
            })
            .catch(error => {
                console.error('Error fetching Oogway image:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the Oogway image.');
            });
    }
};
