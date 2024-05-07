const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { hm, sys, inf, warn, error } = require('./jea/system/logs.js');
const deploy = require('./jea/system/deploy.js');
const ai = require('./jea/assets/ai.js');

const botToken = 'YOUR_BOT_TOKEN'; // Replace with your bot token
const bot = new TelegramBot(botToken, { polling: true });

const scripts = loadScripts('./commands');

cron.schedule('*/30 * * * * *', deleteCacheFiles); // Run every 30 seconds

bot.on('message', handleMessage);

function deleteCacheFiles() {
    const cacheFolder = './commands/cache/';
    fs.readdir(cacheFolder, (err, files) => {
        if (err) {
            error('Error reading cache directory:', err);
            return;
        }
        files.forEach(file => {
            const filePath = path.join(cacheFolder, file);
            fs.unlink(filePath, err => {
                if (err) {
                    error('Error deleting file:', err);
                } else {
                    hm('File deleted:', file);
                }
            });
        });
    });
}

function loadScripts(commandsFolder) {
    const commandPath = path.join(__dirname, commandsFolder);
    const scripts = [];
    fs.readdirSync(commandPath).forEach(file => {
        if (file.endsWith('.js')) {
            const script = require(path.join(commandPath, file));
            const jea = script.jea;
            if (!jea || !jea.name || !jea.description || !jea.author || !jea.category) {
                warn(`Invalid command file: ${file}`);
                return;
            }
            scripts.push({ name: jea.name, description: jea.description, script });
            scripts[jea.name.toLowerCase()] = script;
            if (jea.aliases && Array.isArray(jea.aliases)) {
                jea.aliases.forEach(alias => {
                    scripts[alias.toLowerCase()] = script;
                });
            }
        }
    });
    bot.setMyCommands(scripts.map(({ name, description }) => ({ command: name, description })))
        .catch(error => {});
    return scripts;
}

deploy(); // Deploy commands

// Log bot information
bot.getMe().then(data => {
    inf("Bot Information:");
    inf("Bot Name: " + data.first_name);
    inf("Bot ID: " + data.id);
    inf("Bot Username: @" + data.username);
}).catch(error => {
    warn("Failed to fetch bot information: " + error);
});

async function handleMessage(msg) {
    const { chat, from, text } = msg;
    const { id: chatId } = chat;
    const { id: userId } = from;

    if (!text.startsWith('/')) {
        const aiResponse = await ai.getAIResponse(text);
        if (aiResponse) bot.sendMessage(chatId, aiResponse);
    } else {
        const [scriptName, ...args] = text.slice(1).split(' ');
        const script = scripts[scriptName.toLowerCase()];
        if (script) {
            const { name, usage } = script.jea;
            const formattedUsage = Array.isArray(usage) ? usage.map(u => `/${name} ${u}`).join('\n') : `/${name} ${usage}`;
            const usages = () => bot.sendMessage(chatId, `⦿ Usages:\n${formattedUsage}`);
            script.execute({ bot, chatId, userId, args, msg, usages });
        } else {
            bot.sendMessage(chatId, 'Command not found.');
        }
    }
}

//This bot is made by Lance Ajiro ( Shinpei )