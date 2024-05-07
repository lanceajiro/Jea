// communism.js

const axios = require('axios');
const fs = require('fs');
const { join } = require('path');

module.exports = {
    jea: {
        name: 'communism',
        description: 'Apply a communism filter to your profile photo.',
        author: 'Shinpei',
        usage: '',
        category: 'Fun'
    },
    execute({ bot, chatId, userId }) {
        // Get user's profile photo
        bot.getUserProfilePhotos(userId, { limit: 1 })
            .then(photos => {
                if (photos.total_count === 0) {
                    bot.sendMessage(chatId, 'You need to have a profile photo to use this command.');
                    return;
                }

                // Get the largest available photo size
                const photo = photos.photos[0][photos.photos[0].length - 1];

                // Get the photo file ID
                const fileId = photo.file_id;

                // Get the file path of the profile photo
                bot.getFile(fileId)
                    .then(fileInfo => {
                        const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${fileInfo.file_path}`;

                        // Define API URL with image parameter
                        const apiUrl = `https://api.popcat.xyz/communism?image=${fileUrl}`;

                        // Define cache folder path
                        const cacheFolder = join(__dirname, 'cache');
                        if (!fs.existsSync(cacheFolder)) {
                            fs.mkdirSync(cacheFolder);
                        }

                        // Define image file path
                        const imagePath = join(cacheFolder, `${userId}_communism.jpg`);

                        // Download the communism filtered image from the API
                        axios({
                            url: apiUrl,
                            method: 'GET',
                            responseType: 'stream'
                        })
                            .then(response => {
                                // Save the image to cache
                                response.data.pipe(fs.createWriteStream(imagePath))
                                    .on('finish', () => {
                                        // Send the communism filtered image to the chat
                                        bot.sendPhoto(chatId, fs.createReadStream(imagePath))
                                            .then(() => {
                                                // Delete the cached image after sending
                                                fs.unlinkSync(imagePath);
                                            })
                                            .catch(error => {
                                                console.error('Error sending photo:', error);
                                                bot.sendMessage(chatId, 'An error occurred while sending the communism filtered image.');
                                            });
                                    })
                                    .on('error', error => {
                                        console.error('Error downloading communism filtered image:', error);
                                        bot.sendMessage(chatId, 'An error occurred while downloading the communism filtered image.');
                                    });
                            })
                            .catch(error => {
                                console.error('Error fetching communism filtered image:', error);
                                bot.sendMessage(chatId, 'An error occurred while fetching the communism filtered image.');
                            });
                    })
                    .catch(error => {
                        console.error('Error getting file info:', error);
                        bot.sendMessage(chatId, 'An error occurred while getting your profile photo.');
                    });
            })
            .catch(error => {
                console.error('Error getting user profile photos:', error);
                bot.sendMessage(chatId, 'An error occurred while getting your profile photo.');
            });
    }
};
