// calculateResources.js

function calculateResourceOveruse(userData) {
    const baselineResources = 100; // Baseline sustainable resource units per person per month
    
    // Housing impact
    let housingImpact = 0;
    if (userData.homeType === "Apartment") housingImpact += 8;
    else if (userData.homeType === "House") housingImpact += 25;
    else if (userData.homeType === "Condo") housingImpact += 50;
    else if (userData.homeType === "Townhouse") housingImpact += 20;

    if (userData.homeSize === "Small") housingImpact += 8;
    else if (userData.homeSize === "Medium") housingImpact += 15;
    else if (userData.homeSize === "Large") housingImpact += 25;
    
    if (userData.insulationTrue === "False") housingImpact += 10;
    else housingImpact += 3;

    if (userData.energySavingYes === "Yes") housingImpact -= 10;
    else if (userData.energySavingNo === "No") housingImpact += 25;
    else if (userData.energySavingSome === "Some") housingImpact += 13;

    if (userData.adult === "One") housingImpact += 3;
    else if (userData.adult === "Two") housingImpact += 8;
    else if (userData.adult === "Three or more") housingImpact += 15;

    if (userData.children === "No children") housingImpact += 0;
    else if (userData.children === "One child") housingImpact += 5;
    else if (userData.children === "Two children") housingImpact += 15;
    else if (userData.children === "Three or more children") housingImpact += 25;

    // Energy impact
    let energyImpact = 0;
    if (userData.energyUsage <= 500) energyImpact += 10;
    else if (userData.energyUsage > 500 && userData.energyUsage <= 1500) energyImpact += 25;
    else energyImpact += 40;

    if (userData.renewableEnergy === "Yes, 100% renewable") energyImpact -= 10;
    else if (userData.renewableEnergy === "Partially renewable") energyImpact += 5;
    else if (userData.renewableEnergy === "No") energyImpact += 15;
    else if (userData.renewableEnergy === "I don’t know") energyImpact += 10;

    // Efforts to reduce electricity usage
    if (userData.electricityReduction === "Yes") energyImpact -= 5;
    
    // Transportation impact
    let transportImpact = 0;
    if (userData.vehicleType === "Electric") transportImpact += 5;
    else if (userData.vehicleType === "Gasoline" || userData.vehicleType === "Diesel") transportImpact += 35;
    else if (userData.vehicleType === "Hybrid") transportImpact += 20;
    else if (userData.vehicleType === "None") transportImpact += 0;
    else if (userData.vehicleType === "CNG") transportImpact += 5;

    if (userData.kilometersDriven <= 100) transportImpact += 5;
    else if (userData.kilometersDriven <= 500) transportImpact += 10;
    else if (userData.kilometersDriven <= 1000) transportImpact += 20;
    else transportImpact += 30;

    if (userData.publicTransport === "Daily") transportImpact -= 5;
    else if (userData.publicTransport === "Several times a week") transportImpact += 1;
    else if (userData.publicTransport === "Once a week") transportImpact += 3;
    else if (userData.publicTransport === "Rarely") transportImpact += 5;
    else if (userData.publicTransport === "Never") transportImpact += 10;

    if (userData.flightsTaken === "0 flights") transportImpact += 0;
    else if (userData.flightsTaken === "1 flight") transportImpact += 15;
    else if (userData.flightsTaken === "2 flights") transportImpact += 25;
    else if (userData.flightsTaken === "3+ flights") transportImpact += 40;

    // Diet impact
    let dietImpact = 0;
    if (userData.meatDairyConsumption === "Daily") dietImpact += 15;
    else if (userData.meatDairyConsumption === "A few times a week") dietImpact += 8;
    else if (userData.meatDairyConsumption === "Once a week") dietImpact += 5;
    else if (userData.meatDairyConsumption === "Rarely") dietImpact += 3;
    else if (userData.meatDairyConsumption === "Never") dietImpact += 0;

    if (userData.locallySourcedFood === "Yes, often") dietImpact -= 5;
    else if (userData.locallySourcedFood === "Yes, occasionally") dietImpact += 3;
    else if (userData.locallySourcedFood === "No") dietImpact += 8;
    else if (userData.locallySourcedFood === "I don’t know") dietImpact += 5;

    if (userData.recycling === "100%") dietImpact -= 5;
    else if (userData.recycling === "Most of it") dietImpact += 3;
    else if (userData.recycling === "Some of it") dietImpact += 5;
    else if (userData.recycling === "None") dietImpact += 15;

    // Consumer goods impact
    let consumerImpact = 0;
    if (userData.consumerGoods === "More than 5 items") consumerImpact += 15;
    else if (userData.consumerGoods === "3-5 items") consumerImpact += 10;
    else if (userData.consumerGoods === "1-2 items") consumerImpact += 5;
    else if (userData.consumerGoods === "None") consumerImpact += 0;
    
    if (userData.environmentalImpact === "Yes, I prioritized second-hand or sustainable brands") consumerImpact -= 5;
    else if (userData.environmentalImpact === "Occasionally, but not always") consumerImpact += 5;
    else if (userData.environmentalImpact === "No, I didn’t consider it") consumerImpact += 15;
    else if (userData.environmentalImpact === "I didn’t purchase any consumer goods") consumerImpact += 0;

    if (userData.repairItems === "I always try to repair my things") {
        consumerImpact -= 5; 
    } else if (userData.repairItems === "I do some things myself and sometimes send them for professional repair") {
        consumerImpact += 2; 
    } else if (userData.repairItems === "I rarely repair items; I usually replace them") {
        consumerImpact += 10; 
    } else if (userData.repairItems === "I don’t repair things at all") {
        consumerImpact += 15; 
    }

    if (userData.repurposeItems === "I always look for ways to repurpose items") {
        consumerImpact -= 5; 
    } else if (userData.repurposeItems === "Sometimes, if it’s easy and useful") {
        consumerImpact += 2; 
    } else if (userData.repurposeItems === "I rarely repurpose items") {
        consumerImpact += 10; 
    } else if (userData.repurposeItems === "I don’t repurpose items at all") {
        consumerImpact += 15; 
    }

    // Total resource consumption
    let totalImpact = housingImpact + energyImpact + transportImpact + dietImpact + consumerImpact;

    // Calculate how early in the month they run out of resources
    let daysInMonth = 30;
    let overuseDay = (baselineResources / totalImpact) * daysInMonth;

    // Ensure overuse day doesn't exceed the number of days in the month
    overuseDay = Math.min(overuseDay, daysInMonth);

    return Math.round(overuseDay); // Return the day of the month when resources are depleted
}
