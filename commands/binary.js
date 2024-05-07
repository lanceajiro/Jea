function textToBinary(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(2)).join(' ');
}

function binaryToText(binary) {
    return binary.split(' ').map(code => String.fromCharCode(parseInt(code, 2))).join('');
}

module.exports = {
    jea: {
        name: 'binary',
        description: 'Convert text to binary code and vice versa',
        author: 'Shinpei',
        usage: ['[text]', '[01001000 01100101 01101100 01101100 01101111]'],
        category: 'decoder',
    },
    execute: async function ({ bot, chatId, args, usages }) {
        try {
            if (!args.length) {
                return usages(bot);
            }
            const input = args.join(' ');
            if (/^[01 ]+$/.test(input)) {
                const text = binaryToText(input.replace(/\s/g, ' '));
                return bot.sendMessage(chatId, `${text}`);
            } else {
                const binary = textToBinary(input);
                return bot.sendMessage(chatId, `${binary}`);
            }
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, "🚫 An error occurred while processing the input.");
        }
    }
};
