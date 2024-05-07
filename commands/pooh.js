const axios = require('axios');
const fs = require('fs');
const { join } = require('path');

module.exports = {
    jea: {
        name: 'pooh',
        description: 'Generate an image with Pooh Bear with the specified texts.',
        author: 'Shinpei',
        usage: '[text1] | [text2]',
        category: 'Fun'
    },
    execute({ bot, chatId, args, usages }) {
        const [text1, text2] = args.join(' ').split('|').map(text => encodeURIComponent(text.trim()));

        if (!text1 || !text2) return usages(bot);

        const apiUrl = `https://api.popcat.xyz/pooh?text1=${text1}&text2=${text2}`;

        // Define cache folder path
        const cacheFolder = join(__dirname, 'cache');
        if (!fs.existsSync(cacheFolder)) {
            fs.mkdirSync(cacheFolder);
        }

        // Define image file path
        const imagePath = join(cacheFolder, `pooh_${text1}_${text2}.jpg`);

        // Download the Pooh Bear image from the API
        axios({
            url: apiUrl,
            method: 'GET',
            responseType: 'stream'
        })
            .then(response => {
                // Save the image to cache
                response.data.pipe(fs.createWriteStream(imagePath))
                    .on('finish', () => {
                        // Send the Pooh Bear image to the chat
                        bot.sendPhoto(chatId, fs.createReadStream(imagePath))
                            .then(() => {
                                // Delete the cached image after sending
                                fs.unlinkSync(imagePath);
                            })
                            .catch(error => {
                                console.error('Error sending photo:', error);
                                bot.sendMessage(chatId, 'An error occurred while sending the Pooh Bear image.');
                            });
                    })
                    .on('error', error => {
                        console.error('Error downloading Pooh Bear image:', error);
                        bot.sendMessage(chatId, 'An error occurred while downloading the Pooh Bear image.');
                    });
            })
            .catch(error => {
                console.error('Error fetching Pooh Bear image:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the Pooh Bear image.');
            });
    }
};
