const axios = require('axios');
const fs = require('fs');
const path = require('path');

const cacheDirectory = `${__dirname}/cache/`;

module.exports = {
    jea: {
        name: 'cdp',
        description: 'Get a couple display picture (DP).',
        author: 'Lance Ajiro',
        usage: [],
        category: 'image'
    },
    execute: async function ({ bot, chatId, args }) {
        try {
            const response = await axios.get('https://deku-rest-api.replit.app/cdp');
            const { one, two } = response.data.result;

            const imageUrls = [one, two];
            const media = [];

            for (let i = 0; i < Math.min(imageUrls.length, 10); i++) {
                const imageUrl = imageUrls[i];
                const imagePath = path.join(cacheDirectory, `img${i + 1}.jpg`);

                const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));

                media.push({
                    type: 'photo',
                    media: fs.createReadStream(imagePath),
                    filename: `img${i + 1}.jpg`
                });
            }

            if (media.length > 0) {
                await bot.sendMediaGroup(chatId, media);
            } else {
                await bot.sendMessage(chatId, "No images found.");
            }

            // Optional: Delete cached images after sending
            for (const imagePath of media.map(m => m.media.path)) {
                fs.unlinkSync(imagePath);
            }
        } catch (error) {
            console.error(error);
        }
    }
};
