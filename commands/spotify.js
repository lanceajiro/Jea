const axios = require('axios');
const fs = require('fs');

let path = __dirname + "/cache/spotify.mp3";

module.exports = {
    jea: {
        name: 'spotify',
        description: 'Listen on Spotify using bot',
        author: 'Deku',
        usage: [],
        category: 'media'
    },
    execute: async function ({ bot, chatId, args }) {
        try {
            let songName = args.join(' ');

            if (!songName) {
                bot.sendMessage(chatId, 'Please send the song name to proceed.').then(() => {
                    bot.once('message', async (msg) => {
                        songName = msg.text.trim();

                        if (!songName) {
                            bot.sendMessage(chatId, 'Invalid song name. Please provide a valid song name.');
                            return;
                        }

                        await sendSong(bot, chatId, songName);
                    });
                });
            } else {
                await sendSong(bot, chatId, songName);
            }
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, error.message);
        }
    }
};

async function sendSong(bot, chatId, songName) {
    try {
        bot.sendMessage(chatId, "[ 🔍 ] Searching for “" + songName + "” ...").then(() => {
            axios.get("https://deku-rest-api.replit.app/spotify?q=" + encodeURIComponent(songName))
                .then(async (response) => {
                    const results = response.data;
                    let url = results.result;

                    const dl = (await axios.get(url, { responseType: "arraybuffer" })).data;
                    fs.writeFileSync(path, Buffer.from(dl, "utf-8"));

                    // Send the audio using TelegramBot.sendAudio
                    bot.sendAudio(chatId, path, {
                        contentType: 'audio/mpeg'
                    })
                    .then(() => {
                        console.log("Audio sent successfully!");
                        fs.unlinkSync(path); // Delete the temporary file after sending
                    })
                    .catch((error) => {
                        console.error("Error sending audio:", error);
                        fs.unlinkSync(path); // Delete the temporary file even on error
                    });
                })
                .catch((error) => {
                    console.error(error);
                    bot.sendMessage(chatId, error.message);
                });
        });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, error.message);
    }
}
