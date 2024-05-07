// randomcolor.js

const axios = require('axios');
const fs = require('fs');
const { join } = require('path');

module.exports = {
    jea: {
        name: 'randomcolor',
        description: 'Get a random color.',
        author: 'Shinpei',
        usage: '',
        category: 'Fun'
    },
    execute({ bot, chatId }) {
        axios.get('https://api.popcat.xyz/randomcolor')
            .then(response => {
                const data = response.data;
                const colorHex = data.hex;
                const colorName = data.name;
                const imageUrl = data.image;

                const message = `Random Color: ${colorName} (#${colorHex})`;

                // Download and send the color image as an attachment
                downloadAndSendImage(bot, chatId, message, imageUrl);
            })
            .catch(error => {
                console.error('Error fetching random color:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the random color.');
            });
    }
};

function downloadAndSendImage(bot, chatId, message, imageUrl) {
    const cacheFolder = join(__dirname, 'cache');
    if (!fs.existsSync(cacheFolder)) {
        fs.mkdirSync(cacheFolder);
    }

    const imagePath = join(cacheFolder, 'color.jpg');

    // Download the color image
    axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
    })
    .then(response => {
        response.data.pipe(fs.createWriteStream(imagePath))
            .on('finish', () => {
                // Send the message with the color image as an attachment
                bot.sendPhoto(chatId, fs.createReadStream(imagePath), { caption: message })
                    .then(() => {
                        // Delete the cached image after sending
                        fs.unlinkSync(imagePath);
                    })
                    .catch(error => {
                        console.error('Error sending photo:', error);
                        bot.sendMessage(chatId, 'An error occurred while sending the color image.');
                    });
            })
            .on('error', error => {
                console.error('Error downloading color image:', error);
                bot.sendMessage(chatId, 'An error occurred while downloading the color image.');
            });
    })
    .catch(error => {
        console.error('Error fetching color image:', error);
        bot.sendMessage(chatId, 'An error occurred while fetching the color image.');
    });
}
