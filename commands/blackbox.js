const axios = require('axios');

module.exports = {
    jea: {
        name: 'blackbox',
        aliases: ['bb'],
        description: 'Generate responses from a blackbox model',
        author: 'Shinpei',
        usage: ['[prompt]'],
        category: 'AI'
    },
    execute: async function ({ bot, chatId, args, usages }) {
        try {
            const prompt = args.join(" ");
            if (!prompt) return usages(bot);

            // Send typing action while waiting for response
            await bot.sendChatAction(chatId, 'typing');

            const response = await axios.get(`https://haze-llm-model-74e9fe205264.herokuapp.com/blackbox?prompt=${encodeURIComponent(prompt)}`);
            const responseData = response.data;

            if (!responseData || !responseData.status || !responseData.data) {
                return bot.sendMessage(chatId, "[  ] - An error occurred while generating the response.");
            }

            // Simulate typing delay before sending the response
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Send the response
            bot.sendMessage(chatId, responseData.data);
        } catch (error) {
            console.error("Error generating response from blackbox model:", error);
            bot.sendMessage(chatId, "[ ⚠️ ] - An error occurred while contacting the blackbox model API.");
        }
    }
};
