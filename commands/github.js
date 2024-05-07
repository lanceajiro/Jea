const axios = require('axios');

module.exports = {
    jea: {
        name: 'github',
        description: 'Fetch information about a GitHub user.',
        author: 'Shinpei',
        usage: '[username]',
        category: 'Utility'
    },
    execute({ bot, chatId, args, usages }) {
        const username = args[0];

        if (!username) {
            return usages(bot, chatId);
        }

        const apiUrl = `https://api.popcat.xyz/github/${username}`;

        // Fetch user information from the GitHub API
        axios.get(apiUrl)
            .then(response => {
                const userData = response.data;
                const message = `
GitHub Profile:
👤 Name: ${userData.name}
🏠 URL: ${userData.url}
🏢 Company: ${userData.company}
🔗 Blog: ${userData.blog}
📍 Location: ${userData.location}
📧 Email: ${userData.email}
👤 Bio: ${userData.bio}
🐦 Twitter: ${userData.twitter}
📦 Public Repos: ${userData.public_repos}
📌 Public Gists: ${userData.public_gists}
👥 Followers: ${userData.followers}
👣 Following: ${userData.following}
📅 Created At: ${userData.created_at}
🔄 Last Updated At: ${userData.updated_at}
`;

                // Send the message along with the user's avatar
                bot.sendPhoto(chatId, userData.avatar, { caption: message })
                    .catch(error => {
                        console.error('Error sending photo:', error);
                        bot.sendMessage(chatId, 'An error occurred while sending the GitHub user information.');
                    });
            })
            .catch(error => {
                console.error('Error fetching GitHub user information:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching the GitHub user information.');
            });
    }
};
