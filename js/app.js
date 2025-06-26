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

    // Set initial route if none exists
    if (!window.location.hash) {
        window.location.hash = '#home';
    }
});

// Mobile menu functionality
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const sidebar = document.querySelector('.sidebar');

mobileMenuButton.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !mobileMenuButton.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// Close sidebar when route changes
window.addEventListener('hashchange', () => {
    sidebar.classList.remove('open');
});

// Active link handling
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const hash = window.location.hash || '#home';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.addEventListener('hashchange', updateActiveLink);
window.addEventListener('load', updateActiveLink);    