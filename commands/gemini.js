const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    jea: {
        name: 'gemini',
        description: 'Get responses from the Gemini AI model',
        author: 'Shinpei',
        usage: ['[question]'],
        category: 'AI'
    },
    execute: async function ({ bot, chatId, args, usages }) {
        try {
            const question = args.join(" ");
            if (!question) return usages(bot);

            const response = await axios.get(`https://haze-ultra-advanced-d80346bab842.herokuapp.com/bard?question=${encodeURIComponent(question)}`);
            const responseData = response.data;

            if (!responseData || !responseData.answer) {
                return bot.sendMessage(chatId, "[  ] - An error occurred while generating the response.");
            }

            const answer = responseData.answer;
            const imageUrls = responseData.image_urls || [];

            bot.sendMessage(chatId, answer);

            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const media = [];
            for (let i = 0; i < Math.min(imageUrls.length, 4); i++) {
                const imageUrl = imageUrls[i];
                const imagePath = path.join(cacheDir, `gemini_image_${Date.now()}_${i + 1}.jpg`);

                const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));

                media.push({
                    type: 'photo',
                    media: fs.createReadStream(imagePath)
                });
            }

            if (media.length > 0) {
                bot.sendMediaGroup(chatId, media);
            }
        } catch (error) {
            console.error("Error generating response from Gemini AI model:", error);
            bot.sendMessage(chatId, "[ ⚠️ ] - An error occurred while contacting the Gemini AI model API.");
        }
    }
};
