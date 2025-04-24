let chartInstance;

const labelsByMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const productLabels = ["Handmade Crafts", "Food & Beverages", "Electronics", "Household Items", "Clothing & Accessories"];
const yearlyLabels = ["2022", "2023", "2024"];

// API endpoint
const API_BASE_URL = 'http://localhost:5089/api/Data';

// Chart colors
const colorSchemes = {
    vendors: {
        primary: 'rgba(158, 27, 50, 0.7)',
        border: 'rgba(119, 36, 50, 1)',
        distribution: [
            'rgba(158, 27, 50, 0.7)',    // Crimson
            'rgba(95, 106, 114, 0.7)',    // Pachyderm
            'rgba(193, 198, 201, 0.7)',   // Chimes Gray
            'rgba(218, 215, 203, 0.7)',   // Ivory Tusk
            'rgba(119, 36, 50, 0.7)',     // Bama Burgundy
            'rgba(208, 16, 58, 0.7)'      // Roll Tide Red
        ]
    },
    events: {
        primary: 'rgba(130, 138, 143, 0.7)',
        border: 'rgba(95, 106, 114, 1)',
        distribution: [
            'rgba(130, 138, 143, 0.7)',   // Capstone Gray
            'rgba(158, 27, 50, 0.7)',     // Crimson
            'rgba(95, 106, 114, 0.7)',    // Pachyderm
            'rgba(193, 198, 201, 0.7)',   // Chimes Gray
            'rgba(119, 36, 50, 0.7)',     // Bama Burgundy
            'rgba(208, 16, 58, 0.7)'      // Roll Tide Red
        ]
    },
    registrations: {
        primary: 'rgba(95, 106, 114, 0.7)',
        border: 'rgba(65, 75, 85, 1)',
        distribution: [
            'rgba(95, 106, 114, 0.7)',    // Pachyderm
            'rgba(158, 27, 50, 0.7)',     // Crimson
            'rgba(193, 198, 201, 0.7)',   // Chimes Gray
            'rgba(218, 215, 203, 0.7)',   // Ivory Tusk
            'rgba(119, 36, 50, 0.7)',     // Bama Burgundy
            'rgba(208, 16, 58, 0.7)'      // Roll Tide Red
        ]
    },
    products: {
        primary: 'rgba(119, 36, 50, 0.7)',
        border: 'rgba(89, 26, 40, 1)',
        distribution: [
            'rgba(119, 36, 50, 0.7)',     // Bama Burgundy
            'rgba(158, 27, 50, 0.7)',     // Crimson
            'rgba(95, 106, 114, 0.7)',    // Pachyderm
            'rgba(193, 198, 201, 0.7)',   // Chimes Gray
            'rgba(218, 215, 203, 0.7)',   // Ivory Tusk
            'rgba(208, 16, 58, 0.7)'      // Roll Tide Red
        ]
    }
};

// Available data types and their corresponding API type numbers
const dataTypes = {
    vendors: 0,
    events: 1,
    products: 2,
    registrations: 3
};

// Fetch data from API
async function fetchData(type) {
    try {
        const response = await fetch(`${API_BASE_URL}/${dataTypes[type]}`);
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Filter out admin user (ID: -1) from vendor data
        if (type === 'vendors') {
            return data.filter(vendor => vendor.id !== -1);
        }
        return data;
    } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        return null;
    }
}

// Fetch event names to map event IDs to names
async function fetchEventNames() {
    try {
        const response = await fetch(`${API_BASE_URL}/1`);
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const events = await response.json();
        return events.reduce((map, event) => {
            map[event.id] = event.name;
            return map;
        }, {});
    } catch (error) {
        console.error('Error fetching event names:', error);
        return {};
    }
}

// Process data for visualization
async function processData(data, type) {
    if (!data || !Array.isArray(data)) return null;

    switch (type) {
        case 'vendors':
            // Group vendors by type
            const vendorsByType = {};
            data.forEach(v => {
                const vendorType = v.type || v.Type || 'Unspecified';
                vendorsByType[vendorType] = (vendorsByType[vendorType] || 0) + 1;
            });
            return {
                labels: Object.keys(vendorsByType),
                values: Object.values(vendorsByType),
                types: [...new Set(data.map(v => v.type || v.Type || 'Unspecified'))]
            };

        case 'registrations':
            // Fetch event names first
            const eventNames = await fetchEventNames();
            
            // Group registrations by event and count vendors
            const registrationsByEvent = {};
            data.forEach(r => {
                const eventId = r.eventId || r.EventId;
                const eventName = eventNames[eventId] || `Event #${eventId}`;
                registrationsByEvent[eventName] = (registrationsByEvent[eventName] || 0) + 1;
            });

            // Sort by number of registrations (descending)
            const sortedEntries = Object.entries(registrationsByEvent)
                .sort(([,a], [,b]) => b - a);

            return {
                labels: sortedEntries.map(([name]) => name),
                values: sortedEntries.map(([,count]) => count),
                title: 'Vendor Registrations by Event'
            };

        case 'events':
            // Group events by location
            const eventsByLocation = {};
            data.forEach(e => {
                const location = e.location || e.Location || 'Unknown';
                eventsByLocation[location] = (eventsByLocation[location] || 0) + 1;
            });
            return {
                labels: Object.keys(eventsByLocation),
                values: Object.values(eventsByLocation),
                dates: data.map(e => e.date || e.Date || 'No Date'),
                locations: [...new Set(data.map(e => e.location || e.Location || 'No Location'))]
            };

        case 'products':
            // Show products by name with their counts
            const productCounts = {};
            data.forEach(p => {
                const name = p.name || p.Name || 'Unnamed Product';
                productCounts[name] = (productCounts[name] || 0) + 1;
            });
            return {
                labels: Object.keys(productCounts),
                values: Object.values(productCounts),
                vendorIds: data.map(p => p.vendorId || p.VendorId)
            };

        default:
            return null;
    }
}

// Render chart based on data type
async function renderChart(type = 'vendors', view = 'count') {
    try {
        console.log('Fetching data for type:', type);
        const data = await fetchData(type);
        console.log('Received data:', data);

        if (!data) {
            console.error('No data received from API');
            return;
        }

        console.log('Processing data for visualization');
        const processedData = await processData(data, type);
        console.log('Processed data:', processedData);
        
        if (!processedData) {
            console.error('Failed to process data');
            return;
        }

        const canvas = document.getElementById('reportChart');
        if (!canvas) {
            console.error('Chart canvas element not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }

        console.log('Setting up chart configuration');
    const colors = colorSchemes[type];

        // Destroy existing chart if it exists
        if (chartInstance) {
            console.log('Destroying existing chart');
            chartInstance.destroy();
        }

        let chartData;
        let chartType;
        let chartOptions;

        switch (view) {
            case 'count':
                chartType = 'bar';
                let chartLabel;
                switch (type) {
                    case 'vendors':
                        chartLabel = 'Vendors by Type';
            break;
                    case 'events':
                        chartLabel = 'Events by Location';
            break;
                    case 'products':
                        chartLabel = 'Product Count';
            break;
                    case 'registrations':
                        chartLabel = 'Registrations by Event';
            break;
    }
                chartData = {
                    labels: processedData.labels,
                    datasets: [{
                        label: chartLabel,
                        data: processedData.values,
                        backgroundColor: colors.primary,
                        borderColor: colors.border,
                        borderWidth: 1
                    }]
                };
                break;
            case 'distribution':
                chartType = 'pie';
                chartData = {
                    labels: processedData.labels,
            datasets: [{
                        data: processedData.values,
                        backgroundColor: processedData.labels.map((_, index) => {
                            // Cycle through the distribution colors array
                            return colors.distribution[index % colors.distribution.length];
                        }),
                borderColor: colors.border,
                        borderWidth: 1
                    }]
                };
                break;
            default:
                console.error('Invalid view type:', view);
                return;
        }

        if (!chartData || !chartType) {
            console.error('Failed to create chart configuration');
            return;
        }

        console.log('Chart configuration:', { type: chartType, data: chartData });

        chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${type.charAt(0).toUpperCase() + type.slice(1)} ${view}`
                },
                legend: {
                    display: chartType === 'pie'
                }
            },
            scales: chartType === 'bar' ? {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    }
                }
            } : {}
        };

        console.log('Creating new chart instance');
        chartInstance = new Chart(ctx, {
            type: chartType,
            data: chartData,
            options: chartOptions
        });

        // Update summary statistics
        updateSummaryStats(data, type);
        console.log('Chart rendering complete');
    } catch (error) {
        console.error('Error rendering chart:', error);
    }
}

// Update summary statistics
function updateSummaryStats(data, type) {
    if (!data) return;

    const stats = {
        total: data.length,
        types: type === 'vendors' ? [...new Set(data.map(v => v.type || v.Type || 'Unspecified'))].length : undefined,
        locations: type === 'events' ? [...new Set(data.map(e => e.location || e.Location || 'No Location'))].length : undefined
    };

    document.getElementById('totalCount').textContent = stats.total;
    if (stats.types) document.getElementById('typeCount').textContent = stats.types;
    if (stats.locations) document.getElementById('locationCount').textContent = stats.locations;
}

// Event listeners
document.getElementById("dataType").addEventListener("change", function() {
    renderChart(this.value, document.getElementById("viewType").value);
});

document.getElementById("viewType").addEventListener("change", function() {
    renderChart(document.getElementById("dataType").value, this.value);
});

// Initialize chart on page load with error handling
document.addEventListener("DOMContentLoaded", () => {
    console.log('Page loaded, initializing chart');
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }
    renderChart('vendors', 'count');
});

// Content switching functionality
function loadContent(section) {
    // Hide all content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.style.display = 'none');

    // Show the selected section
    const selectedSection = document.getElementById(`${section}-content`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    // Load section-specific data
    switch(section) {
        case 'reports':
            updateDashboardCards();
            renderChart('vendors', 'count');
            break;
        case 'events':
            loadEvents();
            break;
        case 'vendors':
            loadVendors();
            break;
        case 'settings':
            loadUserSettings();
            break;
    }
}

// Event Management Functions
async function loadEvents() {
    try {
        const response = await fetch('http://localhost:5089/api/Data/1');
        if (!response.ok) throw new Error('Failed to fetch events');
        
        const events = await response.json();
        const tbody = document.getElementById('events-table-body');
        if (!tbody) {
            console.error('Events table body not found');
            return;
        }

        tbody.innerHTML = '';
        events.forEach(event => {
            const row = document.createElement('tr');
            const date = new Date(event.date).toLocaleDateString();
            row.innerHTML = `
                <td>${event.name || 'N/A'}</td>
                <td>${date || 'N/A'}</td>
                <td>${event.location || 'N/A'}</td>
                <td>
                    <button class="delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Update the dashboard cards with actual counts
        updateEventCounts(events);
    } catch (error) {
        console.error('Error loading events:', error);
        const tbody = document.getElementById('events-table-body');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="4">Failed to load events. Please try again later.</td></tr>';
        }
    }
}

// Update event counts in dashboard cards
function updateEventCounts(events) {
    const totalEvents = events.length;
    const currentDate = new Date();
    const activeEvents = events.filter(event => new Date(event.date) >= currentDate).length;
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= currentDate && eventDate <= new Date(currentDate.setDate(currentDate.getDate() + 30));
    }).length;

    // Update the dashboard cards
    const dashCards = document.querySelectorAll('#events-content .card-single h4');
    if (dashCards.length >= 3) {
        dashCards[0].textContent = totalEvents;
        dashCards[1].textContent = activeEvents;
        dashCards[2].textContent = upcomingEvents;
    }
}

// Add event form submission handler
document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', createEvent);
    }
});

async function createEvent(event) {
    event.preventDefault();
    const form = event.target;
    
    // Create event object from form data with capitalized property names to match API model
    const eventData = {
        Name: form.querySelector('input[name="name"]').value,
        Date: form.querySelector('input[name="date"]').value,
        Location: form.querySelector('input[name="location"]').value
    };

    console.log('Sending event data:', eventData); // Debug log

    try {
        const response = await fetch('http://localhost:5089/api/Data/1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create event: ${errorText}`);
        }

        // Reset form and reload events on success
        form.reset();
        await loadEvents();
        alert('Event created successfully!');
    } catch (error) {
        console.error('Error creating event:', error);
        alert('Failed to create event. Please try again. Error: ' + error.message);
    }
}

async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        const response = await fetch(`http://localhost:5089/api/Data/${eventId}/1`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete event');
        }

        await loadEvents();
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
    }
}

// Load vendors data
async function loadVendors() {
    try {
        const response = await fetch('http://localhost:5089/api/Data/0');
        if (!response.ok) throw new Error('Failed to fetch vendors');
        
        const allVendors = await response.json();
        // Filter out admin user
        const vendors = allVendors.filter(vendor => vendor.id !== -1);
        
        const tbody = document.getElementById('vendors-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        vendors.forEach(vendor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vendor.name || 'N/A'}</td>
                <td>${vendor.type || 'N/A'}</td>
                <td>${vendor.address || 'N/A'}</td>
                <td>${vendor.phone || 'N/A'}</td>
                <td>${vendor.email || 'N/A'}</td>
                <td>${vendor.website ? `<a href="${vendor.website}" target="_blank">Visit Site</a>` : 'N/A'}</td>
            `;
            tbody.appendChild(row);
        });

        // Update the dashboard cards with actual counts
        updateVendorCounts(vendors);
    } catch (error) {
        console.error('Error loading vendors:', error);
    }
}

// Update vendor counts in dashboard cards
function updateVendorCounts(vendors) {
    const totalVendors = vendors.length;
    const activeVendors = vendors.filter(v => v.status === 'active').length || Math.floor(totalVendors * 0.7); // Fallback calculation
    const pendingVendors = vendors.filter(v => v.status === 'pending').length || Math.floor(totalVendors * 0.1); // Fallback calculation

    // Update the dashboard cards
    const dashCards = document.querySelectorAll('#vendors-content .card-single h4');
    if (dashCards.length >= 3) {
        dashCards[0].textContent = totalVendors.toLocaleString();
        dashCards[1].textContent = activeVendors.toLocaleString();
        dashCards[2].textContent = pendingVendors.toLocaleString();
    }
}

// Load user settings
function loadUserSettings() {
    // Add event listeners for forms
    const profileForm = document.getElementById('profile-form');
    const securityForm = document.getElementById('security-form');

    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle profile update
            alert('Profile updated successfully!');
        });
    }

    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Handle password update
            alert('Password updated successfully!');
            securityForm.reset();
        });
    }
}

// Update dashboard cards with real data
async function updateDashboardCards() {
    try {
        // Fetch data for all types
        const vendorsResponse = await fetch(`${API_BASE_URL}/0`);
        const eventsResponse = await fetch(`${API_BASE_URL}/1`);
        const productsResponse = await fetch(`${API_BASE_URL}/2`);

        if (!vendorsResponse.ok || !eventsResponse.ok || !productsResponse.ok) {
            throw new Error('Failed to fetch dashboard data');
        }

        const vendors = (await vendorsResponse.json()).filter(vendor => vendor.id !== -1);
        const events = await eventsResponse.json();
        const products = await productsResponse.json();

        // Update dashboard cards
        const dashCards = document.querySelectorAll('.dash-cards .card-single h4');
        if (dashCards.length >= 3) {
            // Total Products
            dashCards[0].textContent = products.length.toLocaleString();
            // Total Vendors (excluding admin)
            dashCards[1].textContent = vendors.length.toLocaleString();
            // Total Events
            dashCards[2].textContent = events.length.toLocaleString();
        }

        // Update corresponding h5 elements with appropriate labels
        const cardLabels = document.querySelectorAll('.dash-cards .card-single h5');
        if (cardLabels.length >= 3) {
            cardLabels[0].textContent = 'Total Products';
            cardLabels[1].textContent = 'Total Vendors';
            cardLabels[2].textContent = 'Total Events';
        }
    } catch (error) {
        console.error('Error updating dashboard cards:', error);
    }
}

/*
 * Future MySQL Integration for 2025 Booth Data
 * This section will be implemented when the vendor registration system is complete
 * 
 * Current Database Schema Reference:
 * 
 * TABLE: vendors
 * - vendor_id (PK)
 * - vendor_name
 * - time_open (when vendor is available at event)
 * - registration_date (when vendor signed up)
 * - other vendor details...
 * 
 * TABLE: booths
 * - booth_id (PK)
 * - booth_size
 * - vendor_id (FK -> vendors.vendor_id)
 * - booking_date (when booth was assigned)
 * - other booth details...
 * 
 * Example API Endpoint:
 * GET /api/booth-registrations/2025
 * Response: {
 *     monthly: {
 *         registrations: [1, 3, 5, 2, ...], // New vendors per month
 *         boothAssignments: [0, 2, 4, 1, ...], // Booths assigned per month
 *         totalVendors: [1, 4, 9, 11, ...] // Cumulative vendors
 *     },
 *     boothSizes: {
 *         'Small (10x10)': count,
 *         'Medium (15x15)': count,
 *         'Large (20x20)': count
 *     },
 *     vendorTimes: {
 *         'Morning (8am-12pm)': count,
 *         'Afternoon (12pm-5pm)': count,
 *         'Evening (5pm-9pm)': count,
 *         'All Day': count
 *     }
 * }
 */

/*
 * Future Implementation:
 * 
 * async function fetch2025BoothData() {
 *     try {
 *         const response = await fetch('/api/booth-registrations/2025');
 *         const data = await response.json();
 *         
 *         // Update 2025 data in reportData
 *         reportData.vendors['2025'] = {
 *             total: data.monthly.totalVendors[data.monthly.totalVendors.length - 1], // Last month's total
 *             byMonth: data.monthly,
 *             boothSizes: data.boothSizes,
 *             vendorTimes: data.vendorTimes
 *         };
 *         
 *         // Update chart if 2025 is selected
 *         if (document.getElementById('yearFilter').value === '2025') {
 *             renderChart();
 *         }
 *     } catch (error) {
 *         console.error('Error fetching 2025 booth data:', error);
 *     }
 * }
 * 
 * // Call this when the page loads and 2025 is selected
 * document.addEventListener('DOMContentLoaded', () => {
 *     if (document.getElementById('yearFilter').value === '2025') {
 *         fetch2025BoothData();
 *     }
 * });
 */

