const axios = require('axios');

module.exports = {
  jea: { 
    name: 'bible', 
    description: 'Get a random Bible verse or specify a verse by providing book name, chapter, and verse number',
    author: 'Shinpei',
    usage: ['[book] [chapter:verse]'],
    category: 'Religion'
  },
  execute: async function ({ bot, chatId, args }) {
    try {
      let endpoint = '';
      switch(args.length) {
        case 0:
          // If no arguments provided, fetch a random Bible verse
          endpoint = 'https://labs.bible.org/api/?passage=random&type=json';
          break;
        case 1:
          // If only book name provided, fetch the first verse of the first chapter
          endpoint = `https://labs.bible.org/api/?passage=${args[0]} 1:1&type=json`;
          break;
        case 2:
          // If book name and chapter number provided, fetch the first verse of the specified chapter
          endpoint = `https://labs.bible.org/api/?passage=${args[0]} ${args[1]}:1&type=json`;
          break;
        case 3:
          // If book name, chapter number, and verse number provided, fetch the specified verse
          endpoint = `https://labs.bible.org/api/?passage=${args[0]} ${args[1]}:${args[2]}&type=json`;
          break;
        default:
          // Invalid number of arguments
          bot.sendMessage(chatId, 'Invalid usage. Please provide either no arguments for a random verse, a book name, a book name and chapter number, or a book name, chapter number, and verse number.');
          return;
      }

      const response = await axios.get(endpoint);
      const verse = response.data[0].text;
      const book = response.data[0].bookname;
      const chapter = response.data[0].chapter;
      const verseNumber = response.data[0].verse;

      bot.sendMessage(chatId, `📖 ${book} ${chapter}:${verseNumber}\n\n${verse}`);
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      bot.sendMessage(chatId, 'An error occurred while fetching the Bible verse. Please try again later.');
    }
  }
};
