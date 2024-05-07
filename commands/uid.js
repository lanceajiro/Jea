module.exports = {
    jea: {
        name: 'uid',
        description: 'Get your Telegram user ID.',
        author: 'Shinpei',
        usage: [],
        category: 'Utility'
    },
    execute: async function ({ bot, chatId, userId }) {
        bot.sendMessage(chatId, `${userId}`);
    }
};
