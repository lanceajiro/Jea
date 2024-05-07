module.exports = {
    jea: {
        name: 'bison',
        description: 'Interact with an AI to get responses to your questions.',
        author: 'Shinpei',
        category: 'AI',
        usage: ['[question]']
    },
    execute: async function ({ bot, chatId, args, usages }) {
        const question = args.join(' ');

        if (!question) {
            return usages(bot);
        }

        try {
            const axios = require('axios');
            const response = await axios.get(`https://hashier-api-text-bison.vercel.app/api/text-bison?chat=${encodeURIComponent(question)}`);
            const aiResponse = response.data.content;
            bot.sendMessage(chatId, aiResponse);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            bot.sendMessage(chatId, 'Failed to get AI response. Please try again later.');
        }
    }
}; 
