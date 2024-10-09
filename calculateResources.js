// calculateResources.js

function calculateResourceOveruse(userData) {
    const baselineResources = 100; // Baseline sustainable resource units per person per month
    
    // Housing impact
    let housingImpact = 0;
    if (userData.homeType === "Apartment") housingImpact += 10;
    else if (userData.homeType === "House") housingImpact += 20;

    if (userData.insulation === "False") housingImpact += 5; // More resources used for heating/cooling

    // Energy impact
    let energyImpact = 0;
    if (userData.energyUsage === "Low") energyImpact += 10;
    else if (userData.energyUsage === "Medium") energyImpact += 20;
    else if (userData.energyUsage === "High") energyImpact += 30;

    if (userData.renewableEnergy === "True") energyImpact -= 5; // Renewable energy reduces resource usage

    // Transportation impact
    let transportImpact = 0;
    if (userData.vehicleType === "Gasoline") transportImpact += 30;
    if (userData.kilometersDriven > 10000) transportImpact += 10;
    if (userData.publicTransport === "True") transportImpact -= 5; // Public transport reduces resource usage
    if (userData.airTravel === "4+") transportImpact += 20;

    // Diet impact
    let dietImpact = 0;
    if (userData.dietType === "Meat-based") dietImpact += 30;
    else if (userData.dietType === "Vegan") dietImpact += 10;

    if (userData.meatFrequency === "Daily") dietImpact += 10;
    if (userData.locallySourcedFood === "True") dietImpact -= 5;
    if (userData.foodWaste === "A lot") dietImpact += 10;

    // Total resource consumption
    let totalImpact = housingImpact + energyImpact + transportImpact + dietImpact;

    // Calculate how early in the month they run out of resources
    let daysInMonth = 30;
    let overuseDay = (baselineResources / totalImpact) * daysInMonth;

    // Ensure overuse day doesn't exceed the number of days in the month
    overuseDay = Math.min(overuseDay, daysInMonth);

    return Math.round(overuseDay); // Return the day of the month when resources are depleted
}
