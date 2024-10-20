// calculateResources.js

function calculateResourceOveruse(userData) {
    const baselineResources = 100; // Baseline sustainable resource units per person per month
    
    // Housing impact
    let housingImpact = 0;
    if (userData.homeType === "Apartment") housingImpact += 8;
    else if (userData.homeType === "House") housingImpact += 25;

    if (userData.insulation === "False") housingImpact += 10;
    else housingImpact += 3;

    if (userData.homeSize === "Large") housingImpact += 15;
    else if (userData.homeSize === "Medium") housingImpact += 8;

    // Energy impact
    let energyImpact = 0;
    if (userData.energyUsage <= 500) energyImpact += 10;
    else if (userData.energyUsage > 500 && userData.energyUsage <= 1500) energyImpact += 25;
    else energyImpact += 40;

    if (userData.renewableEnergy === "Yes, 100% renewable") energyImpact -= 10;
    else if (userData.renewableEnergy === "Partially renewable") energyImpact += 5;
    else if (userData.renewableEnergy === "No") energyImpact += 15;

    // Efforts to reduce electricity usage
    if (userData.electricityReduction === "Yes") energyImpact -= 5;
    
    // Transportation impact
    let transportImpact = 0;
    if (userData.vehicleType === "Electric") transportImpact += 10;
    else if (userData.vehicleType === "Gasoline" || userData.vehicleType === "Diesel") transportImpact += 35;
    else if (userData.vehicleType === "None") transportImpact += 0;

    if (userData.kilometersDriven <= 100) transportImpact += 5;
    else if (userData.kilometersDriven <= 500) transportImpact += 10;
    else if (userData.kilometersDriven <= 1000) transportImpact += 20;
    else transportImpact += 30;

    if (userData.publicTransport === "Daily") transportImpact -= 10;
    else if (userData.publicTransport === "Rarely") transportImpact += 5;
    else if (userData.publicTransport === "Never") transportImpact += 10;

    if (userData.airTravel === "0 flights") transportImpact += 0;
    else if (userData.airTravel === "1 flight") transportImpact += 15;
    else if (userData.airTravel === "2 flights") transportImpact += 25;
    else if (userData.airTravel === "3+ flights") transportImpact += 40;

    // Diet impact
    let dietImpact = 0;
    if (userData.dietType === "Meat-based") dietImpact += 35;
    else if (userData.dietType === "Vegetarian") dietImpact += 15;
    else if (userData.dietType === "Vegan") dietImpact += 5;

    if (userData.meatFrequency === "Daily") dietImpact += 15;
    else if (userData.meatFrequency === "A few times a week") dietImpact += 8;
    else if (userData.meatFrequency === "Once a week") dietImpact += 5;
    else if (userData.meatFrequency === "Rarely") dietImpact += 3;

    if (userData.locallySourcedFood === "Yes, often") dietImpact -= 5;
    else if (userData.locallySourcedFood === "No") dietImpact += 10;

    if (userData.foodWaste === "A lot") dietImpact += 15;
    else if (userData.foodWaste === "Most of it") dietImpact += 8;
    else if (userData.foodWaste === "Some of it") dietImpact += 5;
    else if (userData.foodWaste === "None") dietImpact -= 5;

    // Consumer goods impact
    let consumerImpact = 0;
    if (userData.consumerGoods === "More than 5 items") consumerImpact += 15;
    else if (userData.consumerGoods === "3-5 items") consumerImpact += 10;
    else if (userData.consumerGoods === "1-2 items") consumerImpact += 5;
    
    if (userData.consumerGoodsEffort === "Yes, I prioritized second-hand or sustainable brands") consumerImpact -= 5;
    else if (userData.consumerGoodsEffort === "Occasionally, but not always") consumerImpact += 3;
    else if (userData.consumerGoodsEffort === "No, I didn’t consider it") consumerImpact += 8;

    // Total resource consumption
    let totalImpact = housingImpact + energyImpact + transportImpact + dietImpact + consumerImpact;

    // Calculate how early in the month they run out of resources
    let daysInMonth = 30;
    let overuseDay = (baselineResources / totalImpact) * daysInMonth;

    // Ensure overuse day doesn't exceed the number of days in the month
    overuseDay = Math.min(overuseDay, daysInMonth);

    return Math.round(overuseDay); // Return the day of the month when resources are depleted
}
