const axios = require('axios');

module.exports = {
  jea: { 
    name: 'dogfact', 
    description: 'Get a random dog fact',
    author: 'Shinpei/Deku',
    usage: [],
    category: 'Fun'
  },
  execute: async function ({ bot, chatId }) {
    try {

      const response = await axios.get('https://deku-rest-api.replit.app/dogfact');
      const fact = response.data.fact;

      bot.sendMessage(chatId, `🐕 Random Dog Fact: \n\n${fact}`);
    } catch (error) {
      console.error('Error fetching cat fact:', error);
      bot.sendMessage(chatId, 'An error occurred while fetching the cat fact. Please try again later.');
    }
  }
};
