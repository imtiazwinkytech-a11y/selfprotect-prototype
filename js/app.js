// Collect all your sections into a list
const sections = document.querySelectorAll('section');
let currentIndex = 0;

/**
 * 1. INITIAL SETUP
 * Hide everything except the first section when the site opens.
 */
function initApp() {
    sections.forEach((s, index) => {
        s.style.display = index === 0 ? 'block' : 'none';
    });
    // Set the starting point in the phone's history
    history.replaceState({ index: 0 }, "");
}

/**
 * 2. TRIGGER A PAGE CHANGE
 * Call this function whenever you want to move to the next section 
 * (e.g., after a form is filled or a card is clicked).
 */
function goToNextSection(targetIndex) {
    if (targetIndex >= sections.length || targetIndex < 0) return;

    // Hide current, show next
    sections[currentIndex].style.display = 'none';
    sections[targetIndex].style.display = 'block';
    
    currentIndex = targetIndex;

    // Register this move in the phone's built-in history
    history.pushState({ index: targetIndex }, "");
}

/**
 * 3. THE MAGIC: BUILT-IN BACK BUTTON LISTENER
 * This triggers when the user swipes back or presses the hardware back button.
 */
window.onpopstate = function(event) {
    if (event.state !== null && typeof event.state.index !== 'undefined') {
        // Hide the "current" section
        sections[currentIndex].style.display = 'none';
        
        // Show the "previous" section stored in the phone's history
        const previousIndex = event.state.index;
        sections[previousIndex].style.display = 'block';
        
        // Update our tracker
        currentIndex = previousIndex;
    }
};

// Start the app
initApp();