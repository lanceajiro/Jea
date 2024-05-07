const axios = require('axios');

module.exports = {
    jea: {
        name: 'snow',
        description: 'Interact with snow AI.',
        author: 'Shinpei',
        usage: '[question]',
        category: 'AI'
    },
    execute: function({ bot, chatId, args, usages }) {
        const question = args.join(' ');

        if (!question) return usages(bot);

        axios.get(`https://haze-llm-model-74e9fe205264.herokuapp.com/snow?question=${question}`)
            .then(response => {
                const hazeflake = response.data.hazeflake;
                bot.sendMessage(chatId, hazeflake);
            })
            .catch(error => {
                console.error('Error fetching response from snow API:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching response from snow API.');
            });
    }
};
