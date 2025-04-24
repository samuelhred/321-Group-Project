let allVendors = []; // Store all vendors for filtering

async function HandleOnLoad() {
    try {
        const response = await fetch('http://localhost:5089/api/Data/0');
        const vendors = await response.json();
        // Filter out the admin user (ID: -1)
        allVendors = vendors.filter(vendor => vendor.id !== -1);
        displayVendors(allVendors);
        setupSearchAndFilter();
        populateVendorTypes();
    } catch (error) {
        console.error('Error loading vendors:', error);
        document.getElementById('vendorGrid').innerHTML = '<p>Failed to load vendors. Please try again later.</p>';
    }
}

async function displayVendors(vendors) {
    const vendorGrid = document.getElementById('vendorGrid');
    vendorGrid.innerHTML = '';
    const eventResponse = await fetch('http://localhost:5089/api/Data/1');
    const events = await eventResponse.json();
    const registrationResponse = await fetch('http://localhost:5089/api/Data/3');
    const registrations = await registrationResponse.json();

    if (vendors.length === 0) {
        vendorGrid.innerHTML = '<p>No vendors found matching your criteria.</p>';
        return;
    }

        vendors.forEach(vendor => {
        if (vendor.id !== -1) {
            // Find all events the vendor is registered for
            const registeredEvents = registrations
                .filter(registration => registration.vendorId === vendor.id)
                .map(registration => {
                    return events.find(event => event.id === registration.eventId);
                })
                .filter(event => event !== undefined); // Filter out undefined events

            // Create the vendor card
            const vendorCard = document.createElement('div');
            vendorCard.className = 'vendor-card';

            // Generate the list of event names
            const eventNames = registeredEvents.length > 0
                ? registeredEvents.map(event => event.name).join(', ')
                : 'No Events';

            // Populate the vendor card
            vendorCard.innerHTML = `
                <div class="vendor-info">
                    <h3>${vendor.name}</h3>
                    <p><strong>Type:</strong> ${vendor.type || 'General Vendor'}</p>
                    <p><strong>Website: </strong>${
                        vendor.website 
                            ? `<a href="${vendor.website}" target="_blank" rel="noopener noreferrer">${vendor.website}</a>` 
                            : 'No Website'
                    }</p>
                    <p><strong>Address: </strong>${vendor.address || 'No Address'}</p>
                    <p><strong>Attending:</strong> ${eventNames}</p>
                    <a href="mailto:${vendor.email || '#'}">Contact Vendor</a>
                </div>
            `;

            // Append the vendor card to the grid
            vendorGrid.appendChild(vendorCard);
        }
    });
}

function populateVendorTypes() {
    const typeSelect = document.getElementById('typeSelect');
    
    // Create a map to store unique types (case-insensitive)
    const typeMap = new Map();
    
    // Collect unique types with their original casing
    allVendors.forEach(vendor => {
        if (vendor.type) {
            const lowerType = vendor.type.toLowerCase();
            // Only store the first occurrence of each type (preserving original casing)
            if (!typeMap.has(lowerType)) {
                typeMap.set(lowerType, vendor.type);
            }
        }
    });
    
    // Convert to array and sort alphabetically
    const sortedTypes = Array.from(typeMap.values()).sort((a, b) => 
        a.toLowerCase().localeCompare(b.toLowerCase())
    );
    
    // Clear existing options except the first one
    while (typeSelect.options.length > 1) {
        typeSelect.remove(1);
    }
    
    // Add type options to select
    sortedTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.toLowerCase();
        option.textContent = type;
        typeSelect.appendChild(option);
    });
}

function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const typeSelect = document.getElementById('typeSelect');

    // Add event listeners
    searchInput.addEventListener('input', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
    typeSelect.addEventListener('change', applyFilters);
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sortValue = document.getElementById('sortSelect').value;
    const selectedType = document.getElementById('typeSelect').value.toLowerCase();

    let filteredVendors = [...allVendors];

    // Apply search
    if (searchTerm) {
        filteredVendors = filteredVendors.filter(vendor => 
            (vendor.name && vendor.name.toLowerCase().includes(searchTerm)) ||
            (vendor.description && vendor.description.toLowerCase().includes(searchTerm)) ||
            (vendor.type && vendor.type.toLowerCase().includes(searchTerm)) ||
            (vendor.website && vendor.website.toLowerCase().includes(searchTerm)) ||
            (vendor.address && vendor.address.toLowerCase().includes(searchTerm))
        );
    }

    // Apply type filter
    if (selectedType) {
        filteredVendors = filteredVendors.filter(vendor => 
            vendor.type && vendor.type.toLowerCase() === selectedType
        );
    }

    // Apply sorting
    if (sortValue) {
        if (sortValue === 'name-asc') {
            filteredVendors.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else if (sortValue === 'name-desc') {
            filteredVendors.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        }
    }

    displayVendors(filteredVendors);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', HandleOnLoad);