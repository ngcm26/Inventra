// Inventory Page JavaScript - Enhanced with Reactive Auto-Reorder

document.addEventListener('DOMContentLoaded', function() {
    // Set inventory as active page for navbar
    localStorage.setItem('currentPage', 'inventory');
    
    // Modal functionality
    const addItemModal = document.getElementById('addItemModal');
    const editItemModal = document.getElementById('editItemModal');
    const addItemBtn = document.querySelector('.add-item-btn');
    const editItemBtns = document.querySelectorAll('.edit-item-btn');
    const closeBtns = document.querySelectorAll('.close-btn');
    const cancelBtns = document.querySelectorAll('.cancel-btn');
    
    // Sample item data for editing
    const itemData = {
        'EP-1200-800-HT': {
            name: 'Euro Pallet 1200x800mm',
            details: 'Heat treated, Standard grade',
            sku: 'EP-1200-800-HT',
            currentStock: 45,
            maxStock: 200,
            location: 'Jurong A1',
            supplier: 'Malaysian Timber Co.',
            autoReorder: true,
            criticalThreshold: 80
        },
        'CP-1100-1100-OAK': {
            name: 'Custom Pallet 1100x1100mm',
            details: 'ISPM-15 certified, Oak',
            sku: 'CP-1100-1100-OAK',
            currentStock: 78,
            maxStock: 150,
            location: 'Tuas B2',
            supplier: 'Indonesian Wood Ltd.',
            autoReorder: false,
            criticalThreshold: 60
        },
        'PP-1200-1000-EX': {
            name: 'Pine Pallet 1200x1000mm',
            details: 'Standard, Export grade',
            sku: 'PP-1200-1000-EX',
            currentStock: 320,
            maxStock: 400,
            location: 'Jurong C1',
            supplier: 'Vietnam Pallet Supply',
            autoReorder: false,
            criticalThreshold: 120
        },
        'HW-MIX-HD': {
            name: 'Hardwood Mix Pallet',
            details: 'Mixed hardwood, Heavy duty',
            sku: 'HW-MIX-HD',
            currentStock: 12,
            maxStock: 100,
            location: 'Tuas A3',
            supplier: 'Thai Hardwood Export',
            autoReorder: true,
            criticalThreshold: 30
        }
    };
    
    // Initialize reactive auto-reorder functionality
    function initializeAutoReorderSystem() {
        const inventoryRows = document.querySelectorAll('.inventory-table tbody tr');
        
        inventoryRows.forEach(row => {
            const sku = row.dataset.sku;
            const item = itemData[sku];
            
            if (item) {
                updateAutoReorderStatus(row, item);
            }
        });
    }
    
    // Update auto-reorder status based on stock level and settings
    function updateAutoReorderStatus(row, item) {
        const statusElement = row.querySelector('.auto-reorder-status');
        const toggleButton = row.querySelector('.toggle-auto-reorder');
        const isCritical = item.currentStock <= item.criticalThreshold;
        
        if (isCritical && item.autoReorder) {
            // Critical stock with auto-reorder enabled - show "Re-ordered"
            statusElement.textContent = 'Re-ordered';
            statusElement.setAttribute('data-status', 'reordered');
            toggleButton.textContent = 'Turn Off Auto-Reorder';
        } else if (item.autoReorder) {
            // Auto-reorder enabled but not critical
            statusElement.textContent = 'Auto-Reorder: On';
            statusElement.setAttribute('data-status', 'on');
            toggleButton.textContent = 'Turn Off Auto-Reorder';
        } else {
            // Auto-reorder disabled
            statusElement.textContent = 'Auto-Reorder: Off';
            statusElement.setAttribute('data-status', 'off');
            toggleButton.textContent = 'Turn On Auto-Reorder';
        }
    }
    
    // Toggle auto-reorder functionality
    function setupAutoReorderToggle() {
        const toggleButtons = document.querySelectorAll('.toggle-auto-reorder');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const sku = this.dataset.sku;
                const item = itemData[sku];
                const row = this.closest('tr');
                const statusElement = row.querySelector('.auto-reorder-status');
                
                if (item) {
                    // Toggle auto-reorder setting
                    item.autoReorder = !item.autoReorder;
                    
                    // Add visual feedback during toggle
                    statusElement.textContent = 'Updating...';
                    statusElement.setAttribute('data-status', 'reordering');
                    this.disabled = true;
                    
                    // Simulate API call delay
                    setTimeout(() => {
                        // Update the display
                        updateAutoReorderStatus(row, item);
                        this.disabled = false;
                        
                        // Show confirmation
                        const action = item.autoReorder ? 'enabled' : 'disabled';
                        showNotification(`Auto-reorder ${action} for ${item.name}`, 'success');
                        
                        // If turned on and stock is critical, simulate immediate reorder
                        if (item.autoReorder && item.currentStock <= item.criticalThreshold) {
                            setTimeout(() => {
                                triggerAutoReorder(row, item);
                            }, 1000);
                        }
                    }, 800);
                }
            });
        });
    }
    
    // Trigger auto-reorder for critical stock
    function triggerAutoReorder(row, item) {
        const statusElement = row.querySelector('.auto-reorder-status');
        
        // Show reordering status
        statusElement.textContent = 'Reordering...';
        statusElement.setAttribute('data-status', 'reordering');
        
        // Simulate reorder process
        setTimeout(() => {
            statusElement.textContent = 'Re-ordered';
            statusElement.setAttribute('data-status', 'reordered');
            showNotification(`Automatic reorder placed for ${item.name}`, 'info');
        }, 2000);
    }
    
    // Show notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add notification styles if not present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border-left: 4px solid #3F7AB0;
                    padding: 16px;
                    min-width: 300px;
                    z-index: 1001;
                    animation: slideIn 0.3s ease;
                }
                .notification-success { border-left-color: #059669; }
                .notification-info { border-left-color: #3b82f6; }
                .notification-warning { border-left-color: #f59e0b; }
                .notification-error { border-left-color: #dc2626; }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #1e293b;
                }
                .notification-close {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: none;
                    border: none;
                    font-size: 16px;
                    color: #64748b;
                    cursor: pointer;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());
    }
    
    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    // Open Add Item Modal
    if (addItemBtn) {
        addItemBtn.addEventListener('click', function() {
            addItemModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Open Edit Item Modal
    editItemBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            const item = itemData[itemId];
            
            if (item) {
                // Populate form fields
                document.getElementById('editItemId').value = itemId;
                document.getElementById('editItemName').value = item.name;
                document.getElementById('editItemDetails').value = item.details;
                document.getElementById('editSku').value = item.sku;
                document.getElementById('editCurrentStock').value = item.currentStock;
                document.getElementById('editMaxStock').value = item.maxStock;
                document.getElementById('editLocation').value = item.location;
                document.getElementById('editSupplier').value = item.supplier;
                document.getElementById('editAutoReorder').value = item.autoReorder.toString();
                
                editItemModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modals
    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Close button functionality
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Cancel button functionality
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Handle form submissions
    const addItemForm = document.getElementById('addItemForm');
    const editItemForm = document.getElementById('editItemForm');
    
    if (addItemForm) {
        addItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const newItem = {
                name: formData.get('itemName'),
                details: formData.get('itemDetails'),
                sku: formData.get('sku'),
                maxStock: parseInt(formData.get('maxStock')),
                location: formData.get('location'),
                supplier: formData.get('supplier'),
                autoReorder: formData.get('autoReorder') === 'true'
            };
            
            // In a real application, this would send data to server
            console.log('Adding new item:', newItem);
            showNotification('Item added successfully!', 'success');
            
            closeModal(addItemModal);
            this.reset();
        });
    }
    
    if (editItemForm) {
        editItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const updatedItem = {
                id: formData.get('itemId'),
                name: formData.get('itemName'),
                details: formData.get('itemDetails'),
                sku: formData.get('sku'),
                currentStock: parseInt(formData.get('currentStock')),
                maxStock: parseInt(formData.get('maxStock')),
                location: formData.get('location'),
                supplier: formData.get('supplier'),
                autoReorder: formData.get('autoReorder') === 'true'
            };
            
            // Update local data
            if (itemData[updatedItem.id]) {
                Object.assign(itemData[updatedItem.id], updatedItem);
            }
            
            // In a real application, this would send data to server
            console.log('Updating item:', updatedItem);
            showNotification('Item updated successfully!', 'success');
            
            closeModal(editItemModal);
        });
    }
    
    // Search Functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const tableRows = document.querySelectorAll('.inventory-table tbody tr');
            
            tableRows.forEach(row => {
                const itemName = row.querySelector('.item-info strong').textContent.toLowerCase();
                const sku = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const supplier = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
                
                if (itemName.includes(searchTerm) || sku.includes(searchTerm) || supplier.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // See All Notifications Link
    const seeAllLink = document.querySelector('.see-all-link');
    if (seeAllLink) {
        seeAllLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('This would navigate to a notifications page', 'info');
        });
    }
    
    // Initialize the system
    initializeAutoReorderSystem();
    setupAutoReorderToggle();
    
    console.log('Inventory page loaded with reactive auto-reorder system');
});