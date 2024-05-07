const axios = require('axios');

module.exports = {
    jea: {
        name: 'itunes',
        description: 'Search for a song on iTunes.',
        author: 'Shinpei',
        usage: '[query]',
        category: 'Utility'
    },
    execute({ bot, chatId, args, usages }) {
        if (args.length === 0) return usages(bot);

        const query = encodeURIComponent(args.join(' '));

        // Send the request to the API
        axios.get(`https://api.popcat.xyz/itunes?q=${query}`)
            .then(response => {
                const song = response.data;
                const message = `🎵 *${song.name}* by *${song.artist}*\n📀 Album: ${song.album}\n📅 Release Date: ${song.release_date}\n💰 Price: ${song.price}\n⏱️ Length: ${song.length}\n🎶 Genre: ${song.genre}\n🔗 [Listen on iTunes](${song.url})`;
                bot.sendMessage(chatId, message, { parse_mode: 'Markdown', disable_web_page_preview: true });
                // Send the thumbnail as an image
                bot.sendPhoto(chatId, song.thumbnail);
            })
            .catch(error => {
                console.error('Error fetching iTunes response:', error);
                bot.sendMessage(chatId, 'Sorry, something went wrong while fetching the iTunes response.');
            });
    }
};
