// randomelement.js

const axios = require('axios');
const fs = require('fs');
const { join } = require('path');

module.exports = {
    jea: {
        name: 'randomelement',
        description: 'Get information about a random chemical element from the periodic table.',
        author: 'Shinpei',
        usage: '',
        category: 'study'
    },
    execute({ bot, chatId }) {
        const cacheFolder = join(__dirname, 'cache');

        axios.get('https://api.popcat.xyz/periodic-table/random')
            .then(response => {
                const data = response.data;
                const imagePath = join(cacheFolder, `${data.name.toLowerCase()}.png`);

                const message = `
Name: ${data.name}
Symbol: ${data.symbol}
Atomic Number: ${data.atomic_number}
Atomic Mass: ${data.atomic_mass}
Period: ${data.period}
Phase: ${data.phase}
Discovered By: ${data.discovered_by}
Summary: ${data.summary}
                `;

                // Check if image is already cached
                if (fs.existsSync(imagePath)) {
                    sendWithImage(bot, chatId, message, imagePath);
                } else {
                    // Download and cache the image
                    downloadImage(data.image, imagePath)
                        .then(() => {
                            sendWithImage(bot, chatId, message, imagePath);
                        })
                        .catch(error => {
                            console.error('Error downloading image:', error);
                            bot.sendMessage(chatId, 'An error occurred while downloading the image.');
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the information.');
            });
    }
};

async function downloadImage(imageUrl, imagePath) {
    const writer = fs.createWriteStream(imagePath);

    const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

function sendWithImage(bot, chatId, message, imagePath) {
    bot.sendPhoto(chatId, imagePath, { caption: message })
        .then(() => {
            // Delete the cached image after sending
            fs.unlinkSync(imagePath);
        })
        .catch(error => {
            console.error('Error sending photo:', error);
        });
}
