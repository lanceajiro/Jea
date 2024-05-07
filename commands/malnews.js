// malnews.js

const malScraper = require('mal-scraper');

module.exports = {
    jea: {
        name: 'malnews',
        description: 'Get the latest news of anime from MyAnimeList.',
        author: 'SaikiDesu',
        usage: '[]',
        category: 'anime'
    },
    execute({ bot, chatId }) {
        const nbNews = 5;

        malScraper.getNewsNoDetails(nbNews)
            .then(news => {
                let message = 'TOP 5 LATEST MAL NEWS\n\n';
                news.forEach((item, index) => {
                    message += `『 ${index + 1} 』 ${item.title}\n\n`;
                });

                bot.sendMessage(chatId, message);
            })
            .catch(err => {
                console.error(err);
                bot.sendMessage(chatId, 'An error occurred while fetching the latest news.');
            });
    }
};
