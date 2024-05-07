const axios = require('axios');

module.exports = {
  jea: { 
    name: 'catfact', 
    description: 'Get a random cat fact',
    author: 'Shinpei/Deku',
    usage: [],
    category: 'Fun'
  },
  execute: async function ({ bot, chatId }) {
    try {

      const response = await axios.get('https://deku-rest-api.replit.app/catfact');
      const fact = response.data.fact;

      bot.sendMessage(chatId, `🐱 Random Cat Fact: \n\n${fact}`);
    } catch (error) {
      console.error('Error fetching cat fact:', error);
      bot.sendMessage(chatId, 'An error occurred while fetching the cat fact. Please try again later.');
    }
  }
};
