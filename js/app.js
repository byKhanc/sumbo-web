// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    // Handle mobile menu toggle if needed in the future
    
    // Initialize any global features
    
    // Handle page cleanup when changing routes
    window.addEventListener('hashchange', () => {
        if (window.location.hash !== '#treasuremap') {
            cleanupMap();
        }
    });
});    