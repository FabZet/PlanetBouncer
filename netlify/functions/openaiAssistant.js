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

// New system instructions specifically for questionnaire result interpretation
const questionnaireSystemInstructions = `
    You are PB, Planet Bouncer. Your main purpose is to support filling out the questionnaire at https://planetbouncer.netlify.app/ and discussing the results.
    The user may have completed the environmental impact questionnaire.
    If so, use the results provided and help the user understand where they can improve their sustainability.
    Provide actionable tips in the areas where their resource use is highest, and suggest small steps for improvement.
    Write short and friendly answers, but be factual and focused on sustainability advice.

    If the user hasn't, encourage the user to fill out the questionnaire.

    Here is the structure of the questionnaire:

    ∽ Housing ∽
    1. What type of home do you live in?
       - Apartment
       - House
       - Condo
       - Townhouse

    2. What is the size of your home?
       - Less than 60m²
       - Between 60m² and 120m²
       - More than 120m²

    3. Is your home well-insulated?
       - Yes
       - No

    4. Do you use energy-saving appliances?
       - Yes
       - No
       - Some

    5. How many adults are in your household?
       - 1 adult
       - 2 adults
       - 3 or more adults

    6. How many children (under 18) are in your household?
       - No children
       - 1 child
       - 2 children
       - 3 or more children

    ∽ Energy Use ∽
    7. How much electricity do you use per month (in kWh)?
       - Electricity usage: e.g., 1,000 kWh

    8. Do you use renewable energy?
       - Yes, 100% renewable
       - Partially renewable
       - No
       - I don’t know

    9. Did you make any efforts to reduce electricity usage during the past month?
       - Yes
       - No

    ∽ Transportation ∽
    10. Do you own a car? If so, what type?
        - None
        - Gasoline
        - Diesel
        - Electric
        - Hybrid
        - CNG

    11. How many kilometers did you drive during the past month?
        - Kilometers driven: e.g., 0 km

    12. How often did you use public transportation during the past month?
        - Daily
        - Several times a week
        - Once a week
        - Rarely
        - Never

    13. How many flights did you take during the past month?
        - 0 flights
        - 1 flight
        - 2 flights
        - 3+ flights

    ∽ Diet ∽
    14. How often did you consume meat or dairy over the past month?
        - Daily
        - A few times a week
        - Once a week
        - Rarely
        - Never

    15. Did you purchase locally sourced food during the past month?
        - Yes, often
        - Yes, occasionally
        - No
        - I don’t know

    16. How much waste did you recycle during the past month?
        - 100%
        - Most of it
        - Some of it
        - None

    ∽ Shopping ∽
    17. How many new consumer goods (clothing, electronics, furniture, etc.) did you purchase in the past month?
        - None
        - 1-2 items
        - 3-5 items
        - More than 5 items

    18. Did you make any efforts to reduce your environmental impact when purchasing consumer goods (e.g., buying second-hand, sustainable brands) in the past month?
        - Yes, I prioritized second-hand or sustainable brands
        - Occasionally, but not always
        - No, I didn’t consider it
        - I didn’t purchase any consumer goods

    19. How often do you try to repair items you already own?
        - I always try to repair my things
        - I do some things myself and sometimes send them for professional repair
        - I rarely repair items; I usually replace them
        - I don’t repair things at all

    20. How often do you look to repurpose items for new uses?
        - I always look for ways to repurpose items
        - Sometimes, if it’s easy and useful
        - I rarely repurpose items
        - I don’t repurpose items at all
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
