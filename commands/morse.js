const MORSE_CODE_DICT = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '0': '-----'
};

const REVERSE_MORSE_DICT = {};
Object.entries(MORSE_CODE_DICT).forEach(([key, value]) => {
    REVERSE_MORSE_DICT[value] = key;
});

function textToMorse(text) {
    return text.toUpperCase().split('').map(char => MORSE_CODE_DICT[char] || char).join(' ');
}

function morseToText(morse) {
    return morse.split(' ').map(code => REVERSE_MORSE_DICT[code] || code).join('');
}

module.exports = {
    jea: {
        name: 'morse',
        description: 'Convert text to Morse code and vice versa',
        author: 'Shinpei',
        usage: ['[text]', '[- . -..- -]'], 
        category: 'decoder',
    },
    execute: async function ({ bot, chatId, args, usages }) {
      if (!args.length) {
                return usages(bot);
      }
        try {
            const input = args.join(' ');
            if (input.startsWith('-') || input.startsWith('.')) {
                const text = morseToText(input);
                return bot.sendMessage(chatId, `${text}`);
            } else {
                const morse = textToMorse(input);
                return bot.sendMessage(chatId, `${morse}`);
            }
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, "🚫 An error occurred while processing the input.");
        }
    }
};
