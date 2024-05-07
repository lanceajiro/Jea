const axios = require('axios');

module.exports = {
    jea: {
        name: 'dalle',
        aliases: ['dall-e'],
        description: 'Generate a dream image based on a prompt',
        author: 'Shinpei/Deku',
        usage: ['[prompt]'],
        category: 'AI'
    },
    execute: async function ({ bot, chatId, args, usages }) {
        try {
            const prompt = args.join(" ");
            if (!prompt) return usages(bot);

            bot.sendMessage(chatId, "Generating your request...");

            // Include timestamp in API call to promote fresh results (optional)
            const timestamp = Date.now();
            const response = await axios.get(`https://deku-rest-api.replit.app/dalle?prompt=${encodeURIComponent(prompt)}&timestamp=${timestamp}`, {
                responseType: 'arraybuffer'
            });

            const imageData = Buffer.from(response.data, 'binary');

            bot.sendPhoto(chatId, imageData, {
                caption: `Here's the result for: "${prompt}"`
            });
        } catch (error) {
            console.error("Error generating dall-e image:", error);
            bot.sendMessage(chatId, "An error occurred while contacting the dall-e API.");
        }
    }
};