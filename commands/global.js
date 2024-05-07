module.exports = {
    jea: {
        name: 'global',
        aliases: ['globalgpt'],
        description: 'Interact with an AI to get responses to your questions.',
        author: 'Shinpei',
        category: 'AI',
        usage: ['[question]']
    },
    execute: async function ({ bot, chatId, args, usages }) {
        if (args.length === 0) return usages(bot);

        const question = args.join(' ');

        try {
            const axios = require('axios');
            const response = await axios.get(`https://hashier-api-globalgpt.vercel.app/api/globalgpt?q=${encodeURIComponent(question)}`);
            const aiResponse = response.data.content;
            bot.sendMessage(chatId, aiResponse);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            bot.sendMessage(chatId, 'Failed to get AI response. Please try again later.');
        }
    }
};
