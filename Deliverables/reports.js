let chartInstance;

const labelsByMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const productLabels = ["Handmade Crafts", "Food & Beverages", "Electronics", "Household Items", "Clothing & Accessories"];
const yearlyLabels = ["2022", "2023", "2024"];

// Color schemes for different data types
const colorSchemes = {
    sales: {
        primary: 'rgba(158, 27, 50, 0.7)',
        secondary: 'rgba(158, 27, 50, 0.3)',
        border: 'rgba(119, 36, 50, 1)'
    },
    products: {
        primary: 'rgba(130, 138, 143, 0.7)',
        secondary: 'rgba(130, 138, 143, 0.3)',
        border: 'rgba(95, 106, 114, 1)'
    },
    vendors: {
        primary: 'rgba(95, 106, 114, 0.7)',
        secondary: 'rgba(95, 106, 114, 0.3)',
        border: 'rgba(65, 75, 85, 1)'
    },
    booths: {
        primary: 'rgba(119, 36, 50, 0.7)',
        secondary: 'rgba(119, 36, 50, 0.3)',
        border: 'rgba(89, 26, 40, 1)'
    },
    customers: {
        primary: 'rgba(65, 75, 85, 0.7)',
        secondary: 'rgba(65, 75, 85, 0.3)',
        border: 'rgba(45, 55, 65, 1)'
    }
};

const reportData = {
    sales: {
        '2024': {
            total: 198000,
            byMonth: [12500, 15000, 18000, 22000, 25000, 28000, 30000, 32000, 35000, 38000, 40000, 42000],
            byCategory: {
                'Electronics': 78000,
                'Food & Beverages': 40000,
                'Clothing & Accessories': 34000,
                'Household Items': 30000,
                'Handmade Crafts': 16000
            },
            vendors: {
                'Tech Gear Hub': 22400,
                'Tech Innovations': 28900,
                'Tech Solutions': 26500,
                'Gourmet Delights': 15200,
                'Gourmet Kitchen': 12800,
                'Fresh Delights': 11900,
                'Fashion Forward': 13500,
                'Fashion Trends': 10800,
                'Style Studio': 9600,
                'Home Essentials': 8900,
                'Home Decor Plus': 11200,
                'Home Essentials Plus': 9800,
                'Smith\'s Handcrafted Goods': 7500,
                'Artisan Crafts': 8750
            }
        },
        '2023': {
            total: 170000,
            byMonth: [10000, 12000, 15000, 18000, 20000, 22000, 24000, 26000, 28000, 30000, 32000, 34000],
            byCategory: {
                'Electronics': 65000,
                'Food & Beverages': 35000,
                'Clothing & Accessories': 30000,
                'Household Items': 25000,
                'Handmade Crafts': 15000
            },
            vendors: {
                'Tech Gear Hub': 20000,
                'Tech Innovations': 25000,
                'Tech Solutions': 20000,
                'Gourmet Delights': 13000,
                'Gourmet Kitchen': 11000,
                'Fresh Delights': 11000,
                'Fashion Forward': 12000,
                'Fashion Trends': 9000,
                'Style Studio': 9000,
                'Home Essentials': 8000,
                'Home Decor Plus': 10000,
                'Home Essentials Plus': 7000,
                'Smith\'s Handcrafted Goods': 7000,
                'Artisan Crafts': 8000
            }
        },
        '2022': {
            total: 142000,
            byMonth: [8000, 10000, 12000, 15000, 17000, 19000, 21000, 23000, 25000, 27000, 29000, 31000],
            byCategory: {
                'Electronics': 55000,
                'Food & Beverages': 30000,
                'Clothing & Accessories': 25000,
                'Household Items': 20000,
                'Handmade Crafts': 12000
            },
            vendors: {
                'Tech Gear Hub': 18000,
                'Tech Innovations': 22000,
                'Tech Solutions': 15000,
                'Gourmet Delights': 11000,
                'Gourmet Kitchen': 9000,
                'Fresh Delights': 10000,
                'Fashion Forward': 10000,
                'Fashion Trends': 8000,
                'Style Studio': 7000,
                'Home Essentials': 7000,
                'Home Decor Plus': 8000,
                'Home Essentials Plus': 5000,
                'Smith\'s Handcrafted Goods': 6000,
                'Artisan Crafts': 6000
            }
        }
    },
    products: {
        '2024': {
            total: 8440,
            byMonth: [250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800],
            byCategory: {
                'Electronics': 820,
                'Food & Beverages': 2870,
                'Clothing & Accessories': 2250,
                'Household Items': 1730,
                'Handmade Crafts': 770
            }
        },
        '2023': {
            total: 7400,
            byMonth: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],
            byCategory: {
                'Electronics': 700,
                'Food & Beverages': 2500,
                'Clothing & Accessories': 2000,
                'Household Items': 1500,
                'Handmade Crafts': 700
            }
        },
        '2022': {
            total: 6500,
            byMonth: [150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700],
            byCategory: {
                'Electronics': 600,
                'Food & Beverages': 2200,
                'Clothing & Accessories': 1800,
                'Household Items': 1300,
                'Handmade Crafts': 600
            }
        }
    },
    vendors: {
        '2024': {
            total: 14,
            byMonth: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 14],
            categories: {
                'Electronics': 3,
                'Food & Beverages': 3,
                'Clothing & Accessories': 3,
                'Household Items': 3,
                'Handmade Crafts': 2
            },
            boothSizes: {
                'Small (10x10)': 6,
                'Medium (15x15)': 5,
                'Large (20x20)': 3
            }
        },
        '2023': {
            total: 13,
            byMonth: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 13],
            categories: {
                'Electronics': 3,
                'Food & Beverages': 3,
                'Clothing & Accessories': 3,
                'Household Items': 2,
                'Handmade Crafts': 2
            },
            boothSizes: {
                'Small (10x10)': 5,
                'Medium (15x15)': 4,
                'Large (20x20)': 2
            }
        },
        '2022': {
            total: 12,
            byMonth: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12],
            categories: {
                'Electronics': 3,
                'Food & Beverages': 3,
                'Clothing & Accessories': 2,
                'Household Items': 2,
                'Handmade Crafts': 2
            },
            boothSizes: {
                'Small (10x10)': 4,
                'Medium (15x15)': 3,
                'Large (20x20)': 2
            }
        },
        '2025': {
            total: 0,
            byMonth: {
                registrations: [],
                boothAssignments: [],
                totalVendors: []
            },
            categories: {},
            boothSizes: {
                'Small (10x10)': 0,
                'Medium (15x15)': 0,
                'Large (20x20)': 0
            },
            vendorTimes: {
                'Morning (8am-12pm)': 0,
                'Afternoon (12pm-5pm)': 0,
                'Evening (5pm-9pm)': 0,
                'All Day': 0
            }
        }
    },
    booths: {
        2022: {
            small: 30,
            medium: 35,
            large: 10,
            total: 75
        },
        2023: {
            small: 35,
            medium: 40,
            large: 20,
            total: 95
        },
        2024: {
            small: 45,
            medium: 50,
            large: 25,
            total: 120
        }
    },
    customers: {
        2022: {
            total: 5000,
            byMonth: [300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850],
            byCategory: {
                'Handmade Crafts': 1000,
                'Food & Beverages': 1500,
                'Electronics': 800,
                'Household Items': 1000,
                'Clothing & Accessories': 700
            }
        },
        2023: {
            total: 7000,
            byMonth: [400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950],
            byCategory: {
                'Handmade Crafts': 1500,
                'Food & Beverages': 2000,
                'Electronics': 1000,
                'Household Items': 1500,
                'Clothing & Accessories': 1000
            }
        },
        2024: {
            total: 9000,
            byMonth: [500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050],
            byCategory: {
                'Handmade Crafts': 2000,
                'Food & Beverages': 2500,
                'Electronics': 1500,
                'Household Items': 2000,
                'Clothing & Accessories': 1000
            }
        }
    }
};

const subFilterOptions = {
    sales: ["Monthly", "By Category"],
    products: ["Monthly", "By Category"],
    vendors: ["Monthly", "By Category"],
    booths: ["By Size"],
    customers: ["Monthly", "By Category"]
};

// Update summary stats with overall totals
function updateSummaryStats() {
    const totalVendors = reportData.vendors[2024].total;
    const totalBooths = reportData.booths[2024].total;
    const totalCategories = Object.keys(reportData.vendors[2024].categories).length;
    
    document.getElementById('totalVendors').textContent = totalVendors;
    document.getElementById('totalBooths').textContent = totalBooths;
    document.getElementById('totalCategories').textContent = totalCategories;
}

function renderChart(type = "sales", subFilter = "Monthly", year = "2024") {
    const ctx = document.getElementById('reportChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    let data = [];
    let backgroundColors = [];
    let allLabels = [];
    let chartType = 'bar';
    const colors = colorSchemes[type];

    switch (type) {
        case "sales":
            if (subFilter === "Monthly") {
                data = reportData.sales[year].byMonth;
                allLabels = labelsByMonth;
                chartType = 'line';
                backgroundColors = new Array(data.length).fill(colors.primary);
            } else {
                const categories = Object.keys(reportData.sales[year].byCategory);
                data = Object.values(reportData.sales[year].byCategory);
                allLabels = categories;
                backgroundColors = new Array(data.length).fill(colors.primary);
            }
            break;

        case "products":
            if (subFilter === "Monthly") {
                data = reportData.products[year].byMonth;
                allLabels = labelsByMonth;
                chartType = 'line';
                backgroundColors = new Array(data.length).fill(colors.primary);
            } else {
                const categories = Object.keys(reportData.products[year].byCategory);
                data = Object.values(reportData.products[year].byCategory);
                allLabels = categories;
                backgroundColors = new Array(data.length).fill(colors.primary);
            }
            break;

        case "vendors":
            if (subFilter === "Monthly") {
                data = reportData.vendors[year].byMonth;
                allLabels = labelsByMonth;
                chartType = 'line';
                backgroundColors = new Array(data.length).fill(colors.primary);
            } else {
                const categories = Object.keys(reportData.vendors[year].categories);
                data = Object.values(reportData.vendors[year].categories);
                allLabels = categories;
                backgroundColors = new Array(data.length).fill(colors.primary);
            }
            break;

        case "booths":
            const boothData = reportData.booths[year];
            data = [boothData.small, boothData.medium, boothData.large];
            allLabels = ['Small', 'Medium', 'Large'];
            backgroundColors = [
                colors.primary,
                colors.secondary,
                colors.border
            ];
            break;

        case "customers":
            if (subFilter === "Monthly") {
                data = reportData.customers[year].byMonth;
                allLabels = labelsByMonth;
                chartType = 'line';
                backgroundColors = new Array(data.length).fill(colors.primary);
            } else {
                const categories = Object.keys(reportData.customers[year].byCategory);
                data = Object.values(reportData.customers[year].byCategory);
                allLabels = categories;
                backgroundColors = new Array(data.length).fill(colors.primary);
            }
            break;
    }

    chartInstance = new Chart(ctx, {
        type: chartType,
        data: {
            labels: allLabels,
            datasets: [{
                label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${subFilter}`,
                data: data,
                backgroundColor: backgroundColors,
                borderColor: colors.border,
                borderWidth: 1,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: getYAxisLabel(type)
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

function getYAxisLabel(type) {
    switch(type) {
        case 'sales': return 'Sales Amount ($)';
        case 'products': return 'Number of Products';
        case 'vendors': return 'Number of Vendors';
        case 'booths': return 'Number of Booths';
        case 'customers': return 'Number of Customers';
        default: return 'Count';
    }
}

function populateSubFilters(type) {
    const subFilterDropdown = document.getElementById("subFilter");
    subFilterDropdown.innerHTML = "";

    subFilterOptions[type].forEach(option => {
        const el = document.createElement("option");
        el.value = option;
        el.textContent = option;
        subFilterDropdown.appendChild(el);
    });
}

document.getElementById("dataType").addEventListener("change", function () {
    const type = this.value;
    populateSubFilters(type);
    renderChart(type, subFilterOptions[type][0], document.getElementById("yearFilter").value);
});

document.getElementById("subFilter").addEventListener("change", function () {
    const type = document.getElementById("dataType").value;
    const year = document.getElementById("yearFilter").value;
    renderChart(type, this.value, year);
});

document.getElementById("yearFilter").addEventListener("change", function () {
    const type = document.getElementById("dataType").value;
    const subFilter = document.getElementById("subFilter").value;
    renderChart(type, subFilter, this.value);
});

document.addEventListener("DOMContentLoaded", () => {
    const defaultType = "sales";
    populateSubFilters(defaultType);
    renderChart(defaultType, subFilterOptions[defaultType][0], "2024");
    updateSummaryStats(); // Set initial summary stats
});


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

