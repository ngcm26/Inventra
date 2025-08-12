document.addEventListener('DOMContentLoaded', function() {
    // Get current page from URL or referrer
    const currentPage = getCurrentPage();
    setActiveNavItem(currentPage);

    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-item a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            // Add active class to clicked nav item
            this.closest('.nav-item').classList.add('active');
            
            // Store current page in localStorage for iframe communication
            const href = this.getAttribute('href');
            if (href) {
                localStorage.setItem('currentPage', href.replace('.html', ''));
                
                // If this navbar is in an iframe, tell parent to navigate
                if (window.parent !== window) {
                    window.parent.postMessage({
                        type: 'navigate',
                        url: href
                    }, '*');
                    e.preventDefault(); // Prevent default navigation in iframe
                }
            }
        });
    });

    // User profile functionality
    const userProfile = document.querySelector('.user-profile');
    userProfile.addEventListener('click', function() {
        // Add user menu functionality here
        console.log('User profile clicked');
    });

    function getCurrentPage() {
        // Check localStorage first (for iframe communication)
        const storedPage = localStorage.getItem('currentPage');
        if (storedPage) {
            return storedPage;
        }

        // Try to get from parent window URL if in iframe
        if (window.parent !== window) {
            try {
                const parentUrl = window.parent.location.href;
                const filename = parentUrl.split('/').pop().split('.')[0];
                return filename;
            } catch (e) {
                // Cross-origin restriction, use message passing
                window.parent.postMessage({ type: 'getCurrentPage' }, '*');
            }
        }

        // Get from current window URL
        const currentUrl = window.location.href;
        const filename = currentUrl.split('/').pop().split('.')[0];
        return filename || 'dashboard';
    }

    function setActiveNavItem(pageName) {
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        
        // Map page names to nav items
        const pageMapping = {
            'dashboard': 'dashboard',
            'sale': 'sale',
            'inventory': 'inventory',
            'orders': 'orders',
            'po-view': 'orders',
            'stock-orders': 'orders',
            'po-delete': 'orders',
            'shipping_overview': 'shipment',
            'shipment': 'shipment',
            'update_shipment': 'shipment',
            'live_tracking_shipment': 'shipment',
            'generate_receipt': 'shipment',
            'new_shipment_automated': 'shipment',
            'new_shipment_manual': 'shipment',
            // Payment-related pages all highlight Payment
            'payment': 'payment',
            'update_payment': 'payment',
            'payment_report': 'payment',
            'payment_invoice': 'payment',
            'add_payment': 'payment',
            'inbox': 'inbox',
            'settings': 'settings'
        };

        const navPage = pageMapping[pageName] || pageName;
        const targetNavItem = document.querySelector(`[data-page="${navPage}"]`);
        
        if (targetNavItem) {
            targetNavItem.classList.add('active');
        } else {
            // Default to dashboard if no match
            document.querySelector('[data-page="dashboard"]')?.classList.add('active');
        }
    }

    // Listen for messages from parent window
    window.addEventListener('message', function(event) {
        if (event.data.type === 'setActivePage') {
            setActiveNavItem(event.data.page);
        }
    });

    // Auto-detect active page periodically (for iframe usage)
    setInterval(() => {
        const currentPage = getCurrentPage();
        setActiveNavItem(currentPage);
    }, 1000);
});