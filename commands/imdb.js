const axios = require('axios');

module.exports = {
    jea: {
        name: 'imdb',
        description: 'Get information about a movie or TV show from IMDb.',
        author: 'Shinpei',
        usage: '[query]',
        category: 'Entertainment'
    },
    execute({ bot, chatId, args, usages }) {
        const query = args.join('+');

        if (!query) return usages(bot);

        axios.get(`https://api.popcat.xyz/imdb?q=${query}`)
            .then(response => {
                const data = response.data;
                const ratings = data.ratings.map(rating => `${rating.source}: ${rating.value}`).join('\n');
                const message = `
Title: ${data.title}
Year: ${data.year}
Rated: ${data.rated}
Released: ${data.released}
Runtime: ${data.runtime}
Genres: ${data.genres}
Director: ${data.director}
Writer: ${data.writer}
Actors: ${data.actors}
Plot: ${data.plot}
Ratings: 
${ratings}
IMDb Rating: ${data.rating}
IMDb Votes: ${data.votes}
IMDb ID: ${data.imdbid}
IMDb URL: ${data.imdburl}
                `;

                bot.sendMessage(chatId, message);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the information.');
            });
    }
};
