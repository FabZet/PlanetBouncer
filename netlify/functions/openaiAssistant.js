const fetch = require('node-fetch');

exports.handler = async function (event) {
    const { message } = JSON.parse(event.body);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',  // Use the correct model
                messages: [{ role: 'user', content: message }]
            })
        });

        const data = await response.json();

        const assistantReply = data.choices && data.choices[0] ? data.choices[0].message.content : "I'm not sure how to respond.";
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: assistantReply })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error communicating with OpenAI Assistant' })
        };
    }
};