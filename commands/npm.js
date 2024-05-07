const axios = require('axios');

module.exports = {
    jea: {
        name: 'npm',
        description: 'Get information about an npm package.',
        author: 'Shinpei',
        usage: '[package name]',
        category: 'Utility'
    },
    execute({ bot, chatId, args, usages }) {
        const packageName = args.join(' ');

        if (!packageName) {
            return usages(bot);
        }

        const apiUrl = `https://api.popcat.xyz/npm?q=${encodeURIComponent(packageName)}`;

        // Fetch information about the npm package from the API
        axios.get(apiUrl)
            .then(response => {
                const packageInfo = response.data;

                // Create a formatted message with package information
                const message = `
Name: ${packageInfo.name}
Version: ${packageInfo.version}
Description: ${packageInfo.description}
Keywords: ${packageInfo.keywords}
Author: ${packageInfo.author}
Author Email: ${packageInfo.author_email}
Last Published: ${packageInfo.last_published}
Maintainers: ${packageInfo.maintainers}
Repository: ${packageInfo.repository}
Downloads This Year: ${packageInfo.downloads_this_year}
                `;

                // Send the package information to the chat
                bot.sendMessage(chatId, message);
            })
            .catch(error => {
                console.error('Error fetching npm package information:', error);
                bot.sendMessage(chatId, 'An error occurred while fetching npm package information.');
            });
    }
};
