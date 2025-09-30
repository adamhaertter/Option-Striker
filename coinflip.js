// Coin Flip Module
// Handles all coin flip functionality for determining who bans first

// Modal and coin flip functions
function openCoinModal() {
    const modal = document.getElementById("coin_modal");
    modal.style.display = "block";
    resetCoinFlip();
    
    // Update coin with current input values or defaults
    updateCoinNames();
    
    // Focus on first input for accessibility
    document.getElementById("player1_modal").focus();
}

function closeCoinModal() {
    const modal = document.getElementById("coin_modal");
    modal.style.display = "none";
    resetCoinFlip();
}

function resetCoinFlip() {
    const coin = document.getElementById("animated_coin");
    const resultDiv = document.getElementById("flip_result");
    const startButton = document.getElementById("start_flip_button");
    const flipAgainButton = document.getElementById("flip_again_button");
    
    coin.className = "";
    resultDiv.innerHTML = "";
    startButton.style.display = "block";
    flipAgainButton.style.display = "none";
    
    // Reset coin to show heads side
    coin.style.transform = "rotateY(0deg)";
}

function updateCoinNames() {
    const player1Input = document.getElementById("player1_modal");
    const player2Input = document.getElementById("player2_modal");
    const headsName = document.getElementById("heads_name");
    const tailsName = document.getElementById("tails_name");
    
    const player1Name = player1Input.value.trim() || "Player 1";
    const player2Name = player2Input.value.trim() || "Player 2";
    
    if (headsName) {
        headsName.textContent = player1Name;
    }
    
    if (tailsName) {
        tailsName.textContent = player2Name;
    }
}

function startCoinFlip() {
    // Update coin with player names
    updateCoinNames();
    
    // Hide start button and flip again button
    const startButton = document.getElementById("start_flip_button");
    const flipAgainButton = document.getElementById("flip_again_button");
    startButton.style.display = "none";
    flipAgainButton.style.display = "none";
    
    performFlip();
}

function performFlip() {
    const player1Input = document.getElementById("player1_modal");
    const player2Input = document.getElementById("player2_modal");
    const coin = document.getElementById("animated_coin");
    const resultDiv = document.getElementById("flip_result");
    const flipAgainButton = document.getElementById("flip_again_button");
    
    const player1Name = player1Input.value.trim() || "Player 1";
    const player2Name = player2Input.value.trim() || "Player 2";
    
    // Clear previous result
    resultDiv.innerHTML = "";
    
    // Random coin flip (0 = heads/player1, 1 = tails/player2)
    const coinResult = Math.floor(Math.random() * 2);
    const winner = coinResult === 0 ? player1Name : player2Name;
    
    // Reset any previous animations
    coin.className = "";
    
    // Start the flip animation
    if (coinResult === 0) {
        coin.classList.add("flip-heads");
    } else {
        coin.classList.add("flip-tails");
    }
    
    // Show result after animation completes
    setTimeout(() => {
        resultDiv.innerHTML = `<div class="winner-announcement">🎯 ${winner} bans first!</div>`;
        flipAgainButton.style.display = "block";
        console.log(`Coin flip result: ${winner} bans first`);
    }, 3200);
}

function flipAgain() {
    performFlip();
}

// Handle keyboard events
function handleKeyPress(event) {
    if (event.key === "Escape") {
        const modal = document.getElementById("coin_modal");
        if (modal.style.display === "block") {
            closeCoinModal();
        }
    }
}

// Initialize coin flip functionality
function initializeCoinFlip() {
    // Coin flip modal event listeners
    document.getElementById("coin_flip_button").addEventListener("click", openCoinModal);
    document.getElementById("start_flip_button").addEventListener("click", startCoinFlip);
    document.getElementById("flip_again_button").addEventListener("click", flipAgain);
    document.querySelector(".close_button").addEventListener("click", closeCoinModal);

    // Update coin names in real-time as user types
    document.getElementById("player1_modal").addEventListener("input", updateCoinNames);
    document.getElementById("player2_modal").addEventListener("input", updateCoinNames);

    // Close modal when clicking outside of it
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("coin_modal");
        if (event.target === modal) {
            closeCoinModal();
        }
    });

    // Close modal with ESC key
    document.addEventListener("keydown", handleKeyPress);
    
    console.log("Coin flip module initialized");
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCoinFlip);
} else {
    initializeCoinFlip();
}
