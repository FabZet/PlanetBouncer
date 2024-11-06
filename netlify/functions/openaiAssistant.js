const fetch = require('node-fetch');

exports.handler = async function (event) {
    const { message } = JSON.parse(event.body);

    try {
        const response = await fetch('https://api.openai.com/v1/assistants/YOUR_OPENAI_ASSISTANT_ID/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error communicating with OpenAI Assistant' })
        };
    }
};
