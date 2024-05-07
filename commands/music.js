const axios = require('axios');
const fs = require('fs');
const { Innertube, UniversalCache } = require('youtubei.js');

module.exports = {
    jea: {
        name: 'music',
        description: 'Search and download music from YouTube.',
        author: 'Shinpei',
        usage: ['[song title]'],
        category: 'media'
    },
    execute: async function ({ bot, chatId, args, usages }) {
        try {
            const data = args;

            const songTitle = data.join(" ");

            if (songTitle.length === 0) {
                return usages(bot);
            }

            const cacheDir = __dirname + '/cache';
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir);
            }

            const yt = await Innertube.create({ cache: new UniversalCache(cacheDir), generate_session_locally: true });
            const search = await yt.music.search(songTitle, { type: 'video' });

            if (search.results[0] === undefined) {
                return bot.sendMessage(chatId, "⚠️ Audio not found!");
            }

            bot.sendMessage(chatId, `🔍 Searching for the music: ${songTitle}...`);

            // Get the info and stream the audio
            const info = await yt.getBasicInfo(search.results[0].id);
            const url = info.streaming_data?.formats[0].decipher(yt.session.player);
            const stream = await yt.download(search.results[0].id, {
                type: 'audio', // audio, video or video+audio
                quality: 'best', // best, bestefficiency, 144p, 240p, 480p, 720p and so on.
                format: 'mp4' // media container format 
            });

            const file = fs.createWriteStream(`${__dirname}/cache/${info.basic_info['title']}`);

            async function writeToStream(stream) {
                const startTime = Date.now();
                let bytesDownloaded = 0;

                for await (const chunk of stream) {
                    await new Promise((resolve, reject) => {
                        file.write(chunk, (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                bytesDownloaded += chunk.length;
                                resolve();
                            }
                        });
                    });
                }

                const endTime = Date.now();
                const downloadTimeInSeconds = (endTime - startTime) / 1000;
                const downloadSpeedInMbps = (bytesDownloaded / downloadTimeInSeconds) / (1024 * 1024);

                return new Promise((resolve, reject) => {
                    file.end((error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve({ downloadTimeInSeconds, downloadSpeedInMbps });
                        }
                    });
                });
            }

            async function main() {
                const { downloadTimeInSeconds, downloadSpeedInMbps } = await writeToStream(stream);
                const fileSizeInMB = file.bytesWritten / (1024 * 1024);

                bot.sendAudio(chatId, `${__dirname}/cache/${info.basic_info['title']}`);
            }

            main();
        } catch (error) {
            console.error("Error fetching response:", error);
            bot.sendMessage(chatId, "[ ⚠️ ] - An error occurred while fetching the response.");
        }
    }
};
