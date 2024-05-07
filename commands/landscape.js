const fs = require('fs');
const request = require('request');

module.exports = {
    jea: {
        name: 'landscape',
        description: 'Get a random landscape image.',
        author: 'Lance Ajiro',
        usage: [],
        category: 'image'
    },
    execute: async function ({ bot, chatId, userId }) {
        try {
            request("https://source.unsplash.com/1600x900/?landscape")
                .pipe(fs.createWriteStream(__dirname + '/cache/photo.png'))
                .on('finish', () => {
                    bot.sendPhoto(chatId, fs.createReadStream(__dirname + "/cache/photo.png"))
                        .then(() => fs.unlinkSync(__dirname + "/cache/photo.png"))
                        .catch((error) => handleErrorResponse(bot, chatId, error));
                });
        } catch (error) {
            handleErrorResponse(bot, chatId, error);
        }
    }
};

function handleErrorResponse(bot, chatId, error) {
    const errorMessage = error ? error.toString() : "Error!";
    bot.sendMessage(chatId, errorMessage);
    console.log(errorMessage);
}
