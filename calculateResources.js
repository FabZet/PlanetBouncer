// calculateResources.js

function calculateResourceOveruse(userData) {
    const baselineResources = 100; // Baseline sustainable resource units per person per month
    
    // Housing impact
    let housingImpact = 0;
    if (userData.homeType === "Apartment") housingImpact += 8;
    else if (userData.homeType === "House") housingImpact += 25;

    if (userData.insulation === "False") housingImpact += 10;
    else housingImpact += 3;

    // Energy impact
    let energyImpact = 0;
    if (userData.energyUsage === "Low") energyImpact += 10;
    else if (userData.energyUsage === "Medium") energyImpact += 25;
    else if (userData.energyUsage === "High") energyImpact += 40;

    if (userData.renewableEnergy === "True") energyImpact -= 10;
    else energyImpact += 10;

    // Transportation impact
    let transportImpact = 0;
    if (userData.vehicleType === "Electric") transportImpact += 10;
    else if (userData.vehicleType === "Gasoline") transportImpact += 35;
    if (userData.kilometersDriven > 15000) transportImpact += 15;
    else if (userData.kilometersDriven < 5000) transportImpact += 5;

    if (userData.publicTransport === "True") transportImpact -= 10;

    if (userData.airTravel === "None") transportImpact += 0;
    else if (userData.airTravel === "1-3") transportImpact += 15;
    else if (userData.airTravel === "4+") transportImpact += 30;

    // Diet impact
    let dietImpact = 0;
    if (userData.dietType === "Meat-based") dietImpact += 35;
    else if (userData.dietType === "Vegetarian") dietImpact += 15;
    else if (userData.dietType === "Vegan") dietImpact += 5;

    if (userData.meatFrequency === "Daily") dietImpact += 15;
    else if (userData.meatFrequency === "Weekly") dietImpact += 8;
    else if (userData.meatFrequency === "Rarely") dietImpact += 3;

    if (userData.locallySourcedFood === "True") dietImpact -= 5;
    if (userData.foodWaste === "A lot") dietImpact += 15;
    else if (userData.foodWaste === "Some") dietImpact += 8;

    // Total resource consumption
    let totalImpact = housingImpact + energyImpact + transportImpact + dietImpact;

    // Calculate how early in the month they run out of resources
    let daysInMonth = 30;
    let overuseDay = (baselineResources / totalImpact) * daysInMonth;

    // Ensure overuse day doesn't exceed the number of days in the month
    overuseDay = Math.min(overuseDay, daysInMonth);

    return Math.round(overuseDay); // Return the day of the month when resources are depleted
}
