let allVendors = []; // Store all vendors for filtering

async function HandleOnLoad() {
    try {
        const response = await fetch('http://localhost:5089/api/Data/0');
        allVendors = await response.json();
        displayVendors(allVendors);
        setupSearchAndFilter();
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
                <p>${vendor.type || 'General Vendor'}</p>
                <p>${vendor.website || 'No Website'}</p>
                <p>${vendor.address || 'No Address'}</p>
                <a href="mailto:${vendor.email || '#'}">Contact Vendor</a>
            </div>
        `;
        
        vendorGrid.appendChild(vendorCard);
    });
}

function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');

    // Add event listeners for both search and filter
    searchInput.addEventListener('input', () => {
        applySearchAndFilter();
    });

    filterSelect.addEventListener('change', () => {
        applySearchAndFilter();
    });
}

function applySearchAndFilter() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterValue = document.getElementById('filterSelect').value;

    let filteredVendors = [...allVendors];

    // Apply search
    if (searchTerm) {
        filteredVendors = filteredVendors.filter(vendor => 
            vendor.name.toLowerCase().includes(searchTerm) ||
            (vendor.description && vendor.description.toLowerCase().includes(searchTerm)) ||
            (vendor.type && vendor.type.toLowerCase().includes(searchTerm))
        );
    }

    // Apply filter
    if (filterValue) {
        if (filterValue === 'name-asc') {
            filteredVendors.sort((a, b) => a.name.localeCompare(b.name));
        } else if (filterValue === 'name-desc') {
            filteredVendors.sort((a, b) => b.name.localeCompare(a.name));
        } else if (filterValue.startsWith('type-')) {
            const type = filterValue.replace('type-', '');
            filteredVendors = filteredVendors.filter(vendor => 
                vendor.type && vendor.type.toLowerCase() === type.toLowerCase()
            );
        }
    }

    displayVendors(filteredVendors);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', HandleOnLoad);




