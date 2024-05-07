const axios = require('axios');

module.exports = {
  jea: { 
    name: 'quote', 
    description: 'Get a random quote',
    author: 'Shinpei',
    usage: [],
    category: 'Fun'
  },
  execute: async function ({ bot, chatId }) {
    try {

      const response = await axios.get('https://api.quotable.io/random');
      const quote = response.data.content;
      const author = response.data.author;

      bot.sendMessage(chatId, `📜 Random Quote:\n\n"${quote}"\n\n- ${author}`);
    } catch (error) {
      console.error('Error fetching random quote:', error);
      bot.sendMessage(chatId, 'An error occurred while fetching the random quote. Please try again later.');
    }
  }
};
