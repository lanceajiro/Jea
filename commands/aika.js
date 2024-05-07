const axios = require('axios');

module.exports = {
    jea: {
        name: 'aika',
        description: 'Ask Aika, a 14-year-old Japanese girl, questions.',
        author: 'Shinpei',
        usage: ['[question]'],
        category: 'AI'
    },
    execute: async function ({ bot, chatId, args, usages }) {
        try {

            const question = args.join(' ');
          
            if (!question) return usages(bot)

          const prompt = "Pretend to be Aika, a 14-year-old Japanese girl who is incredibly intelligent and knowledgeable about everything.";

            // Send typing action while waiting for response
            await bot.sendChatAction(chatId, 'typing');

            const response = await axios.get(`https://chatgpt35-api.vercel.app/ai?ask=${encodeURIComponent(question)}&prompt=${encodeURIComponent(prompt)}`);
            const responseData = response.data;

            if (!responseData || !responseData.reply) {
                return bot.sendMessage(chatId, "[  ] - An error occurred while fetching the response.");
            }

            // Simulate typing delay before sending the response
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Send the response
            bot.sendMessage(chatId, responseData.reply);
        } catch (error) {
            console.error("Error fetching response from Aika API:", error);
            bot.sendMessage(chatId, "[ ⚠️ ] - An error occurred while fetching the response.");
        }
    }
};
