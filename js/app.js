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

function setSidebarOpen(open) {
    if (open) {
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open');
    } else {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
    }
}

mobileMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    setSidebarOpen(!sidebar.classList.contains('open'));
});

// Close sidebar when clicking outside (on mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            setSidebarOpen(false);
        }
    }
});

// Close sidebar when route changes
window.addEventListener('hashchange', () => {
    setSidebarOpen(false);
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