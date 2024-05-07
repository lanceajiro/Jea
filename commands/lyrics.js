const axios = require('axios');
const fs = require('fs');

const cacheDir = __dirname + "/cache"; // Replace with your desired cache directory

module.exports = {
  jea: {
    name: 'lyrics',
    description: 'Get lyrics for a song',
    author: 'Shinpei/Deku',
    usage: ['[song title]'],
    category: 'media'
  },
  execute: async function ({ bot, chatId, args, usages }) {
    try {
      const songTitle = args.join(" ");
      if (!songTitle) return usages(bot);

      bot.sendMessage(chatId, "[ 🔍 ] Searching for lyrics...");

      const response = await axios.get(`https://deku-rest-api.replit.app/search/lyrics?q=${encodeURIComponent(songTitle)}`);
      const lyricsData = response.data.result;

      if (!lyricsData) {
        return bot.sendMessage(chatId, "[  ] - Could not find lyrics for \"" + songTitle + "\".");
      }

      const lyrics = lyricsData.lyrics;
      const title = lyricsData.title;
      const artist = lyricsData.artist;
      const imageUrl = lyricsData.image; // Optional: If the API provides an image URL

      // Check if lyrics length is suitable for a single message
      if (lyrics.length <= 4000) {
        const formattedLyrics = `Title: ${title} - ${artist}\n\n${lyrics}`; // Add title and artist for better formatting
        return bot.sendMessage(chatId, formattedLyrics, { // Send formatted message directly
          parse_mode: 'Markdown', // Use Markdown formatting
          caption: imageUrl // Add image URL as caption
        });
      }

      // Create a temporary file for long lyrics
      const tempFile = createTempFile(cacheDir, lyrics);

      const message = `Title: ${title} - ${artist}\n\nLyrics for "${songTitle}" are too long. Here's a file containing the lyrics:`;

      // Send the message with image preview (if available)
      bot.sendPhoto(chatId, imageUrl, message, { // Send image with caption
        parse_mode: 'Markdown' // Use Markdown formatting
      })
        .then(() => bot.sendDocument(chatId, tempFile)) // Send lyrics document
        .then(() => fs.unlinkSync(tempFile)) // Delete temporary file after sending
        .catch((error) => {
          console.error("Error sending lyrics:", error);
        });
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      bot.sendMessage(chatId, "[ ⚠️ ] - An error occurred while searching for lyrics.");
    }
  }
};

// Function to create temporary text file (place this outside the module.exports)
function createTempFile(cacheDir, content) {
  const fileName = `${cacheDir}/lyrics_${Date.now()}.txt`;
  fs.writeFileSync(fileName, content);
  return fileName;
}
