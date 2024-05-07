const axios = require('axios');

async function getAIResponse(input) {
    try {
        const containsQuestion = /(\b(what|how|did|where|who)\b|ai|jea|wataru|lance)/i.test(input);
        
        if (!containsQuestion) return null;

        const response = await axios.get(`https://hashier-api-globalgpt.vercel.app/api/globalgpt?q=${encodeURIComponent(input)}`);
        
        return response.data.content;
    } catch (error) {
        console.error('Error fetching AI response:', error);
        return 'Sorry, I couldn\'t fetch a response at the moment.';
    }
}

module.exports = { getAIResponse };
