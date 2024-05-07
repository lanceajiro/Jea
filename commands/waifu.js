const axios = require('axios');
const fs = require('fs');
const request = require('request');
const cache = `${__dirname}/cache/`;

module.exports = {
  jea: {
    name: "waifu",
    description: "Get a random waifu photo",
    author: "Lance Ajiro",
    category: "anime",
    usage: "Available categories: waifu, neko, shinobu, megumin, bully, cuddle, cry, hug, awoo, kiss, lick, pat, smug, bonk, yeet, blush, smile, wave, highfive, handhold, nom, bite, glomp, slap, kill, kick, happy, wink, poke, dance, cringe"
  },
  execute: async function ({ bot, chatId, args }) {
    const category = args[0] ? args[0].toLowerCase() : "waifu";
    const validCategories = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo", "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", "handhold", "nom", "bite", "glomp", "slap", "kill", "kick", "happy", "wink", "poke", "dance", "cringe"];

    if (!validCategories.includes(category)) {
      bot.sendMessage(chatId, `Invalid category. Available categories: ${validCategories.join(", ")}`);
      return;
    }

    const url = `https://api.waifu.pics/sfw/${category}`;

    try {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      const callback = () => {
        bot.sendPhoto(chatId, imageUrl, {
          caption: `Here's your ${category}:`
        }).then(() => {
          fs.unlinkSync(`${cache}${category}.png`);
        }).catch((error) => {
          console.error(error);
        });
      };

      const imageCachePath = `${cache}${category}.png`;
      if (fs.existsSync(imageCachePath)) {
        // If the image already exists in the cache, send it from the cache.
        callback();
      } else {
        // If the image doesn't exist in the cache, download it and save it to the cache.
        request(encodeURI(imageUrl)).pipe(fs.createWriteStream(imageCachePath)).on('close', callback);
      }
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, "Oops, something went wrong :(");
    }
  }
};
