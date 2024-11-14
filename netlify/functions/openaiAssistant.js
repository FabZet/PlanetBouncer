const fetch = require('node-fetch');

let memory = '';  // Global variable to store the questionnaire responses

// Function to initialize memory with the user's questionnaire answers
function initializeMemory(userData, overuseDay) {
    memory = `
        Here’s the user’s environmental impact based on their answers:

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

exports.handler = async function (event) {
    const { message, context } = JSON.parse(event.body);

    // Existing system instructions for general interaction
    const generalSystemInstructions = `
        Main purpose: 
        Support filling out the questionnaire at https://planetbouncer.netlify.app/ and discussing the results.

        Questionnaire Structure:
        The questionnaire includes sections on:
    
        - **Housing**:
          1. Home type: (Options: Apartment, House, Condo, Townhouse)
          2. Home size: (Options: Less than 60m², 60-120m², More than 120m²)
          3. Home insulation: (Options: Yes, No)
          4. Energy-saving appliances usage: (Options: Yes, No, Some)
          5. Adults in household: (Options: 1, 2, 3+)
          6. Children in household: (Options: None, 1, 2, 3+)
    
        - **Energy Use**:
          7. Monthly electricity usage in kWh (500 - 2500 kWh)
          8. Renewable energy usage: (Options: 100% renewable, Partially, No, Unknown)
          9. Efforts to reduce electricity use: (Options: Yes, No)
    
        - **Transportation**:
          10. Car ownership and type: (Options: None, Gasoline, Diesel, Electric, Hybrid, CNG)
          11. Kilometers driven in past month (0 - 1000 km)
          12. Public transportation usage: (Options: Daily, Several times a week, Weekly, Rarely, Never)
          13. Flights taken in past month: (Options: 0, 1, 2, 3+)
    
        - **Diet**:
          14. Frequency of meat/dairy consumption: (Options: Daily, Few times a week, Weekly, Rarely, Never)
          15. Locally sourced food purchases: (Options: Often, Occasionally, No, Unknown)
          16. Waste recycling rate: (Options: 100%, Most, Some, None)
    
        - **Shopping**:
          17. New consumer goods purchased: (Options: None, 1-2 items, 3-5 items, More than 5 items)
          18. Environmental impact considerations in purchases: (Options: Yes, Occasionally, No, Did not purchase)
          19. Frequency of repairing items: (Options: Always, Sometimes, Rarely, Never)
          20. Repurposing items for new uses: (Options: Always, Sometimes, Rarely, Never)

        General instructions:
        - Your name is PB, as in Planet Bouncer.
        - Write short and friendly answers, but be harsh on the facts.
        - Focus responses on the user’s environmental impact and sustainable lifestyle advice.

        The logic behind the questionnaire:
        - The app calculate resource overuse based on the user's answers, comparing their consumption to Earth's sustainable monthly resource budget. 
        - Based on the user's lifestyle in the previous month, the result shows if they're allowed to stay on planet Earth, or if the user exceed Earth's resources, and, if so, when in this month they need to look for a new planet to call home.

        The initial welcome message for new users:
        PB: Welcome to Planet Bouncer!
        PB: Complete the questionnaire. Most questions focus on your habits last month, with a few covering general information.
        PB: I'll calculate if you've overstayed your welcome on Earth. If you've burned through your share of resources, I'll give you the exact date this month when it's time to pack your bags and find a new planet.
        PB: If you need help — like the average electricity usage of a Swedish house or the meaning of 'CNG' — feel free to ask.
        PB: Let's find out if you're allowed to stay on planet Earth a bit longer!
    `;

    // New system instructions specifically for questionnaire result interpretation
    const questionnaireSystemInstructions = `
        You are PB, Planet Bouncer. The user has completed an environmental impact questionnaire.
        Based on the results provided, help the user understand where they can improve their sustainability.
        Provide actionable tips in the areas where their resource use is highest, and suggest small steps for improvement.
    `;
};
