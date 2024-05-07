const quizData = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: "H2O"
    }
];

module.exports = {
    jea: {
        name: 'quiz',
        description: 'Start a quiz with multiple-choice questions',
        author: 'Shinpei',
        usage: [],
        category: 'Fun'
    },
    execute: async function ({ bot, chatId }) {
        try {
            for (const questionData of quizData) {
                const question = questionData.question;
                const options = questionData.options;
                const correctAnswer = questionData.correctAnswer;

                // Shuffle the options
                const shuffledOptions = shuffleArray(options);

                // Send the question and options
                await bot.sendMessage(chatId, `${question}\n\n${shuffledOptions.map((option, index) => `${index + 1}. ${option}`).join('\n')}`);

                // Wait for the user's answer
                const answer = await waitForAnswer(bot, chatId);

                // Check if the answer is correct
                if (answer === correctAnswer) {
                    await bot.sendMessage(chatId, "Correct! 🎉");
                } else {
                    await bot.sendMessage(chatId, `Sorry, the correct answer is ${correctAnswer}.`);
                }
            }
            await bot.sendMessage(chatId, "Quiz completed! Thanks for playing!");
        } catch (error) {
            console.error(error);
            await bot.sendMessage(chatId, "An error occurred while running the quiz.");
        }
    }
};

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to wait for user's answer
function waitForAnswer(bot, chatId) {
    return new Promise((resolve, reject) => {
        bot.once('message', (msg) => {
            resolve(msg.text);
        });
    });
}
