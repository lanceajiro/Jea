const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports = {
    jea: {
        name: 'shoti',
        description: 'Generate a random TikTok video.',
        author: 'libyzxy0',
        usage: [],
        category: 'Entertainment'
    },
    execute: async function ({ bot, chatId, userId }) {
        try {
            bot.sendChatAction(chatId, 'upload_video');

            const response = await axios.post('https://shoti-server-v2.vercel.app/api/v1/get', { apikey: '$shoti-1hjvb0q3sokk2bvme' });

            const path = __dirname + '/cache/shoti.mp4';
            const file = fs.createWriteStream(path);
            const rqs = request(encodeURI(response.data.data.url));
            rqs.pipe(file);

            file.on('finish', () => {
                setTimeout(function() {
                    bot.sendVideo(chatId, fs.createReadStream(path), {
                        caption: `Username : @${response.data.data.user.username}\nNickname : ${response.data.data.user.nickname}`
                    }).then(() => fs.unlinkSync(path))
                    .catch((error) => handleErrorResponse(bot, chatId, error));
                }, 5000);
            });

            file.on('error', (err) => {
                handleErrorResponse(bot, chatId, err);
            });

        } catch (err) {
            handleErrorResponse(bot, chatId, err);
        }
    }
};

function handleErrorResponse(bot, chatId, error) {
    const errorMessage = error ? error.toString() : 'Error!';
    bot.sendMessage(chatId, errorMessage);
    console.log(errorMessage);
}
