module.exports = {
    jea: {
        name: 'llama',
        description: 'Interact with an AI to get responses to your questions.',
        author: 'Shinpei',
        category: 'AI',
        usage: ['[question]']
    },
    execute: async function ({ bot, chatId, args, usages }) {
        const question = args.join(' ');

        if (!question) return usages(bot);

        try {
            const axios = require('axios');
            const response = await axios.get(`https://hashier-api-groq.vercel.app/api/groq/llama?ask=${encodeURIComponent(question)}`);
            const aiResponse = response.data.response;
            bot.sendMessage(chatId, aiResponse);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            bot.sendMessage(chatId, 'Failed to get AI response. Please try again later.');
        }
    }
};
