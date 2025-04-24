let allVendors = []; // Store all vendors for filtering

async function HandleOnLoad() {
    try {
        const response = await fetch('http://localhost:5089/api/Data/0');
        allVendors = await response.json();
        displayVendors(allVendors);
        setupSearchAndFilter();
        populateVendorTypes();
    } catch (error) {
        console.error('Error loading vendors:', error);
        document.getElementById('vendorGrid').innerHTML = '<p>Failed to load vendors. Please try again later.</p>';
    }
}

function displayVendors(vendors) {
    const vendorGrid = document.getElementById('vendorGrid');
    vendorGrid.innerHTML = '';

    if (vendors.length === 0) {
        vendorGrid.innerHTML = '<p>No vendors found matching your criteria.</p>';
        return;
    }

    vendors.forEach(vendor => {
        const vendorCard = document.createElement('div');
        vendorCard.className = 'vendor-card';
        
        vendorCard.innerHTML = `
            <div class="vendor-info">
                <h3>${vendor.name}</h3>
                <p><strong>Type:</strong> ${vendor.type || 'General Vendor'}</p>
                <p>${vendor.website || 'No Website'}</p>
                <p>${vendor.address || 'No Address'}</p>
                <a href="mailto:${vendor.email || '#'}">Contact Vendor</a>
            </div>
        `;
        
        vendorGrid.appendChild(vendorCard);
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




