const axios = require('axios');

module.exports = {
  jea: { 
    name: 'fact', 
    description: 'Get a random fact',
    author: 'Shinpei',
    usage: [],
    category: 'Fun'
  },
  execute: async function ({ bot, chatId }) {
    try {

      const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      const fact = response.data.text;

      bot.sendMessage(chatId, `📚 Random Fact: \n\n${fact}`);
    } catch (error) {
      console.error('Error fetching random fact:', error);
      bot.sendMessage(chatId, 'An error occurred while fetching the random fact. Please try again later.');
    }
  }
};
