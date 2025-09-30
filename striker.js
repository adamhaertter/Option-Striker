const TEST_DATA = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6", "Option 7", "Option 8", "Option 9", "Option 10"];
const MSS_DATA = ["Bowser Castle", "Bowser Jr. Playroom", "Daisy Cruiser Day", "Daisy Cruiser Night", "DK Jungle Day", "DK Jungle Night", "Luigi Mansion", "Mario Stadium Day", "Mario Stadium Night", "Peach Ice Garden Day", "Peach Ice Garden Night", "Wario City Day", "Wario City Night", "Yoshi Park Day", "Yoshi Park Night"];

let numOptions = 5;
let data = MSS_DATA
const datasetControl = [MSS_DATA] // Add more datasets as needed

function updateData(options, dataset) {
    numOptions = options
    data = datasetControl[dataset]
    
    const numInput = document.getElementById("num_options");
    const maxDisplay = document.getElementById("max_value");
    
    numInput.max = data.length;
    maxDisplay.textContent = data.length;
    
    // Validate current value doesn't exceed new max
    validateInput();
}

function selectRandomOptions() {
    let rand = 0;
    const workingArray = [...data]; // Create a copy of the data array
    const outputArray = new Array(numOptions)
    for(let i = 0; i < numOptions; i++) {
        rand = Math.floor(Math.random() * workingArray.length)
        outputArray[i] = workingArray[rand];
        workingArray.splice(rand, 1);
        console.log("Selected: " + outputArray[i] + ", Remaining: " + workingArray);        
    }
    return outputArray
}

function renderImages() {
    const container = document.getElementById("output_segment");
    container.innerHTML = ""; // clear existing images
    const selected = selectRandomOptions();
    selected.forEach((item, i) => {
        const div = document.createElement("div");
        div.className = "output_item";
        container.appendChild(div);
        const img = document.createElement("img");
        img.src = `img/${item}.png`;
        img.alt = item;
        
        // Toggle 'struck' class and banned overlay on click
        div.addEventListener("click", () => {
            strike(div, "P1")
        });

        // Right click
        div.addEventListener("contextmenu", function(event) {
            event.preventDefault(); // Prevent the default context menu
            strike(div, "P2", true); // Strike as Player 2
        });

        const label = document.createElement("label");
        label.innerText = item;

        div.appendChild(img);
        div.appendChild(label);
    });
}

function strike(div, playerName, isPlayer2 = false) {
    const container = document.getElementById("output_segment");
    const allMaps = container.querySelectorAll(".output_item");
    const struckMaps = container.querySelectorAll(".output_item.struck");
    const isCurrentlyStruck = div.classList.contains("struck");
    
    // If trying to ban a map (not unbanning), check if this would be the last map
    if (!isCurrentlyStruck) {
        const mapsAfterBan = struckMaps.length + 1;
        if (mapsAfterBan >= allMaps.length) {
            // Prevent banning the last map - show visual feedback
            showLastMapProtection(div);
            return;
        }
    }
    
    div.classList.toggle("struck");
    
    // Check if banned overlay already exists
    const existingBannedOverlay = div.querySelector(".banned-overlay");
    if (existingBannedOverlay) {
        // Remove the banned overlay
        existingBannedOverlay.remove();
    } else {
        // Create and add the banned overlay
        const bannedOverlay = document.createElement("div");
        bannedOverlay.classList.add("banned-overlay"); 
        if(isPlayer2) {
            bannedOverlay.classList.add("player2"); // Add player2 class for styling
        }
        bannedOverlay.textContent = `BANNED (${playerName})`;
        div.appendChild(bannedOverlay);
    }
}

function getStrikePattern(n) {
    if(n < 2) return [];
    // Initialization
    let strikeOrder = [];
    
    // Limit strikes per turn
    const maxStrikesPerTurn = 3;

    // Assign each player a number of total strikes 
    // For odd n, Player 1 gets the extra strike
    let strikesP1 = Math.ceil((n - 1) / 2);
    let strikesP2 = Math.floor((n - 1) / 2);

    // Alternate strikes until one player runs out
    let strikesThisTurn = 0;
    while (strikesP1 > 0 && strikesP2 > 0) {
        // Player 1's turn
        strikesThisTurn = Math.min(maxStrikesPerTurn, strikesP1);
        strikeOrder.push(strikesThisTurn);
        strikesP1 -= strikesThisTurn;
        
        // Player 2's turn
        strikesThisTurn = Math.min(maxStrikesPerTurn, strikesP2);
        strikeOrder.push(strikesThisTurn);
        strikesP2 -= strikesThisTurn;
    }

    if(strikesP1 > 0) strikeOrder.push(strikesP1);
    if(strikesP2 > 0) strikeOrder.push(strikesP2);

    // Dock 1 strike from Player 1's first turn and add it on the end to ensure P1 goes last.
    if(strikeOrder[0] != 1) {
        strikeOrder[0] -= 1;
        strikeOrder.push(1);
    }
    if(strikeOrder.length %2 == 0 && n > 3) {
        // If even number of turns, ensure P1 goes last by forcing an increase on P2's first ban.
        strikeOrder[1] += strikeOrder.pop();
    }
    return strikeOrder;
}

function displayStrikePattern() {
    const patternContainer = document.getElementById("strike_pattern_container");
    patternContainer.innerHTML = ""; // Clear previous pattern
    const strikeOrder = getStrikePattern(numOptions);
    strikeOrder.forEach((strike, index) => {
        const span = document.createElement("span");
        span.className = "strike_pattern_item";
        span.title = `Player ${index % 2 == 0 ? "1" : "2"}: ${strike} strike${strike > 1 ? "s" : ""}`;
        if(index % 2 != 0) {
            span.classList.add("p2_strike_item");
        }
        span.textContent = index != strikeOrder.length-1 ? strike + " - " : strike;
        patternContainer.appendChild(span);
    });
}

function validateInput() {
    const numInput = document.getElementById("num_options");
    let value = parseInt(numInput.value);
    const min = parseInt(numInput.min);
    const max = parseInt(numInput.max);
    
    // Reset to max if value exceeds maximum
    if (value > max) {
        value = max;
        numInput.value = max;
        
        // Visual feedback for correction
        numInput.style.background = 'oklch(50% 0.15 0)'; // Red flash
        setTimeout(() => {
            numInput.style.background = '';
        }, 300);
    }
    
    // Reset to min if value is below minimum
    if (value < min || isNaN(value)) {
        value = min;
        numInput.value = min;
    }
    
    numOptions = value;
    return value;
}

function generate() {
    validateInput(); // Ensure valid value before generating
    renderImages();
    displayStrikePattern();
    console.log(`Recommended strike order: ${getStrikePattern(numOptions).join(", ")}`);
}

function incrementValue() {
    const input = document.getElementById("num_options");
    const currentValue = parseInt(input.value);
    const maxValue = parseInt(input.max);
    
    if (currentValue < maxValue) {
        input.value = currentValue + 1;
        validateInput();
    }
}

function decrementValue() {
    const input = document.getElementById("num_options");
    const currentValue = parseInt(input.value);
    const minValue = parseInt(input.min);
    
    if (currentValue > minValue) {
        input.value = currentValue - 1;
        validateInput();
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("lightmode");
    console.log("Toggled dark mode");
}

function toggleGreenScreen() {
    const target = document.getElementById("output_segment")
    const button = document.getElementById("green_screen_button")
    //target.style.backgroundColor = target.style.backgroundColor === "green" ? "transparent" : "green";
    target.style.backgroundColor = getNextScreenColor(getComputedStyle(target).backgroundColor);
    button.style.backgroundColor = getNextScreenColor(getComputedStyle(button).backgroundColor);

    console.log("Toggled green screen");
}

function getNextScreenColor(currentColor) {
    let newColor = "rgb(0, 255, 0)"
    switch(currentColor) {
        case "rgb(0, 255, 0)":  newColor = "rgb(255, 0, 255)"; break;       // Green to Magenta
        case "rgb(255, 0, 255)": newColor = "rgb(0, 0, 255)"; break;        // Magenta to Blue
        case "rgb(0, 0, 255)": newColor = "rgb(0, 255, 255)"; break;        // Blue to Cyan
        case "rgb(0, 255, 255)": newColor = "rgb(200, 191, 231)"; break;    // Cyan to Lavender
        case "rgb(200, 191, 231)": newColor = "rgb(255, 255, 0)"; break;    // Lavender to Yellow
        case "rgb(255, 255, 0)": newColor = "rgb(0, 0, 0)"; break;          // Yellow to Black
        case "rgb(0, 0, 0)": newColor = "rgb(255, 255, 255)"; break;        // Black to White
        case "rgb(255, 255, 255)": newColor = "transparent"; break;           // White to Transparent
        // Cases reset to green on their own
    }
    return newColor;
}

function toggleTransparency() {
    // Give all images under output_segment a notransparency class
    const container = document.getElementById("output_segment");
    container.classList.toggle("notransparency");
    const button = document.getElementById("transparency_button");
    button.style.backgroundColor = button.style.backgroundColor === "yellow" ? "red" : "yellow";
    console.log("Toggled transparency");
}

function showLastMapProtection(mapDiv) {
    // Create and show a temporary "DECIDER" overlay
    const protectedOverlay = document.createElement("div");
    protectedOverlay.className = "protected-overlay";
    protectedOverlay.textContent = "DECIDER";
    mapDiv.appendChild(protectedOverlay);
    
    // Add shake animation to the map
    mapDiv.classList.add("shake-protection");
    
    // Remove the overlay and shake effect after animation
    setTimeout(() => {
        if (protectedOverlay.parentNode) {
            protectedOverlay.remove();
        }
        mapDiv.classList.remove("shake-protection");
    }, 1500);
    
    console.log("Cannot ban the last remaining map!");
}

updateData(numOptions, 0);
renderImages();
displayStrikePattern();

// Event listeners
document.getElementById("generate_button").addEventListener("click", generate);
document.getElementById("dark_mode_button").addEventListener("click", toggleDarkMode);
document.getElementById("green_screen_button").addEventListener("click", toggleGreenScreen);
document.getElementById("transparency_button").addEventListener("click", toggleTransparency);

// Number input validation and controls
document.getElementById("num_options").addEventListener("input", validateInput);
document.getElementById("num_options").addEventListener("blur", validateInput);
document.getElementById("increase_btn").addEventListener("click", incrementValue);
document.getElementById("decrease_btn").addEventListener("click", decrementValue);