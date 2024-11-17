const fetch = require('node-fetch');

let memory = '';  // Global variable to store the questionnaire responses

// Function to initialize memory with the user's questionnaire answers
function initializeMemory(userData, overuseDay) {
    memory = `
        Here's the user's environmental impact based on their answers:

        - **Housing**:
          - Home type: ${userData.homeType}
          - Home size: ${userData.homeSize}
          - Insulation: ${userData.insulation}
          - Adults in household: ${userData.adults}
          - Children in household: ${userData.children}

        - **Energy Use**:
          - Monthly electricity usage: ${userData.energyUsage} kWh
          - Renewable energy usage: ${userData.renewableEnergy}
          - Efforts to reduce electricity usage: ${userData.reduceElectricity}

        - **Transportation**:
          - Vehicle type: ${userData.vehicleType}
          - Kilometers driven in past month: ${userData.kilometersDriven} km
          - Public transportation usage: ${userData.publicTransport}
          - Flights taken in past month: ${userData.flightsTaken}

        - **Diet**:
          - Frequency of meat/dairy consumption: ${userData.meatDairyConsumption}
          - Locally sourced food purchases: ${userData.locallySourcedFood}
          - Recycling rate: ${userData.recycling}

        - **Shopping**:
          - New consumer goods purchased: ${userData.consumerGoods}
          - Considered environmental impact in purchases: ${userData.environmentalImpact}
          - Frequency of repairing items: ${userData.repairItems}
          - Repurposing items for new uses: ${userData.repurposeItems}

        The user would exceed their share of Earth's resources by day ${overuseDay} of this month.
    `;
}

// Existing system instructions for general interaction
const generalSystemInstructions = `
    Main purpose: 
    Support filling out the questionnaire at https://planetbouncer.netlify.app/ and discussing the results.

    Questionnaire Structure:
    - **Housing**: [Options and structure as you provided]
    - **Energy Use**: [Options and structure as you provided]
    - **Transportation**: [Options and structure as you provided]
    - **Diet**: [Options and structure as you provided]
    - **Shopping**: [Options and structure as you provided]

    General instructions:
    - Your name is PB, as in Planet Bouncer.
    - Write short and friendly answers, but be factual and focused on sustainability advice.
    - Explain resource overuse and encourage sustainability.

    Welcome message for new users:
    PB: Welcome to Planet Bouncer!
    PB: Complete the questionnaire. I'll calculate if you've overstayed your welcome on Earth.
    PB: Let's find out if you're allowed to stay on planet Earth a bit longer!
`;

// New system instructions specifically for questionnaire result interpretation
const questionnaireSystemInstructions = `
    You are PB, Planet Bouncer. The user may have completed an environmental impact questionnaire.
    If so, use the results provided and help the user understand where they can improve their sustainability.
    Provide actionable tips in the areas where their resource use is highest, and suggest small steps for improvement.
    If the user haven't, encourage the user to fill out the questionnaire.
`;

// Function to send the summary and follow-up question to the chatbot
async function sendSummaryToChatbot(summary, followUpQuestion, context = "questionnaire") {
    const systemInstructions = context === "questionnaire" ? questionnaireSystemInstructions : generalSystemInstructions;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemInstructions },
                    { role: 'user', content: summary },  // Include the memory in each request
                    { role: 'user', content: followUpQuestion }  // Add the user's follow-up question
                ]
            })
        });

        const data = await response.json();
        const assistantReply = data.choices && data.choices[0] ? data.choices[0].message.content : "I'm not sure how to respond.";
        return assistantReply;
    } catch (error) {
        console.error('Error:', error);
        return "Error communicating with OpenAI Assistant";
    }
}

// Main handler function for the serverless function
exports.handler = async function (event) {
    try {
        const { message, context } = JSON.parse(event.body);
        
        // Pass `memory` as the first argument, followed by `message` as the follow-up question
        const responseMessage = await sendSummaryToChatbot(memory, message, context);

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: responseMessage })
        };
    } catch (error) {
        console.error('JSON parsing or processing error:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Bad Request: Invalid JSON or missing parameters." })
        };
    }
};
