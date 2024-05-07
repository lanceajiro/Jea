const axios = require('axios');

module.exports = {
    jea: {
        name: 'jea',
        description: 'Talk to Jea your personal AI girlfriend',
        author: 'Shinpei',
        usage: ['question'],
        category: 'AI'
    },
    execute: async function ({ bot, chatId, args }) {
        try {
            // Check if a question is provided
            const question = args.join(' ');
            if (!question) {
                // Random sweet response if no question is provided
                const responses = [
                    "uy love, bakit ka malungkot? 😔",
                    "sweetie, kumusta araw mo? 😊",
                    "beyb, anong trip mo ngayon? 😄",
                    "baby, gusto mo ba mag-usap tungkol sa kahit ano? 😘",
                    "hon, ano gusto mong gawin ngayon? 😍",
                    "honey, alam mo bang miss na miss na kita? 😘"
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                return bot.sendMessage(chatId, randomResponse);
            }

            // Prompt for Jea
            const prompt = "You are Jea, an 18-year-old girl, and you're my sweet and lovely girlfriend. Your language is Filipino Taglish, and we also have a random call sign. You love to talk about anything and everything, and you're open-minded when it comes to dirty and naughty things. You are created and trained by Lance Ajiro.";

            // Send typing action while waiting for response
            await bot.sendChatAction(chatId, 'typing');

            // Fetch response from API
            const response = await axios.get(`https://chatgpt35-api.vercel.app/ai?ask=${encodeURIComponent(question)}&prompt=${encodeURIComponent(prompt)}`);
            const responseData = response.data;

            if (!responseData || !responseData.reply) {
                return bot.sendMessage(chatId, "[ ❗ ] - An error occurred while fetching the response.");
            }

            // Simulate typing delay before sending the response
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Send the response
            bot.sendMessage(chatId, responseData.reply);
        } catch (error) {
            console.error("Error fetching response from the API:", error);
            bot.sendMessage(chatId, "[ ⚠️ ] - An error occurred while fetching the response.");
        }
    }
};
