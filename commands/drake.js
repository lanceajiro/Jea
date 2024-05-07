const axios = require('axios');
const fs = require('fs');
const { join } = require('path');

module.exports = {
    jea: {
        name: 'drake',
        description: 'Generate a meme with two images and two texts.',
        author: 'Shinpei',
        usage: ['[text1] | [text2]'],
        category: 'Fun'
    },
    execute({ bot, chatId, args, usages }) {
        const [text1, text2] = args.join(' ').split(' | ');

        if (!text1 || !text2) {
            return usages(bot);
        }

        // Define API URL with text parameters
        const apiUrl = `https://api.popcat.xyz/drake?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`;

        // Define cache folder path
        const cacheFolder = join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolder)) {
            fs.mkdirSync(cacheFolder);
        }

        // Define image file path
        const imagePath = join(cacheFolder, `drake_${Date.now()}.jpg`);

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
