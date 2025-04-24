// Get the vendor ID from localStorage (set during login)
const vendorId = localStorage.getItem("vendorId");

if (!vendorId) {
    // If no vendor ID is found, redirect to the login page
    alert("You must log in to access the dashboard.");
    window.location.href = "Login.html";
}

// Fetch and display vendor info and registrations
async function loadDashboard() {
    try {
        // Fetch all registrations
        const registrationsResponse = await fetch(`http://localhost:5089/api/Data/3`);
        const eventsResponse = await fetch(`http://localhost:5089/api/Data/1`);
        const vendorResponse = await fetch(`http://localhost:5089/api/Data/${vendorId}/0`);
        const productsResponse = await fetch(`http://localhost:5089/api/Data/2`);

        

        if (!registrationsResponse.ok) {
            const errorText = await registrationsResponse.text();
            console.error("Registrations API error response:", errorText);
            throw new Error("Failed to fetch registrations.");
        }

        if (!eventsResponse.ok) {
            const errorText = await eventsResponse.text();
            console.error("Events API error response:", errorText);
            throw new Error("Failed to fetch events.");
        }

        // Parse JSON responses safely
        const allRegistrations = await safeJsonParse(registrationsResponse) || [];
        const allEvents = await safeJsonParse(eventsResponse) || [];
        const vendor = await safeJsonParse(vendorResponse);
        const allProducts = await safeJsonParse(productsResponse) || [];

        document.getElementById("vendor-info").innerHTML = `<h3>Welcome, ${vendor.name}</h3>`;

        // Filter registrations for the logged-in vendor
        const vendorRegistrations = allRegistrations.filter(
            (registration) => registration.vendorId === parseInt(vendorId)
        );
        console.log("All Registrations:", vendorRegistrations);

        // Add event and product details to registrations
        vendorRegistrations.forEach((registration) => {
            const event = allEvents.find((event) => event.id === registration.eventId);
            if (event) {
                registration.eventName = event.name;
                registration.Date = event.date;
                registration.location = event.location;
            }

            const product = allProducts.find((product) => product.id === registration.productId);
            if (product) {
                registration.productName = product.name;
                registration.productDescription = product.description;
            }
        });
        console.log("Vendor Registrations with Products:", vendorRegistrations);

    // Display registrations
    const registrationsList = document.getElementById("registrations-list");
    if (vendorRegistrations.length === 0) {
        registrationsList.innerHTML = "<li>No registrations found.</li>";
    } else {
        registrationsList.innerHTML = vendorRegistrations
            .map(
                (registration) => `
                <div class="registration-box">
                    <h3>${registration.eventName || "N/A"}</h3>
                    <p><strong>Date:</strong> ${registration.Date || "N/A"}</p>
                    <p><strong>Location:</strong> ${registration.location || "N/A"}</p>
                    ${
                        registration.productName
                            ? `
                            <p><strong>Product:</strong> ${registration.productName}</p>
                            <p><strong>Description:</strong> ${registration.productDescription}</p>
                        `
                            : "<p><strong>Product:</strong> None</p>"
                    }
                    <button class="btn btn-remove" data-id="${registration.id}">Remove Registration</button>
   
                </div>
            `
            )
            .join("");
        }
        document.getElementById("registrations-list").addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-remove")) {
                const registrationId = e.target.getAttribute("data-id");
        
                // Call the removeRegistration function
                removeRegistration(registrationId);
            }
        });
        

        // Add event listener to the "Make New Registration" button
        document.getElementById("new-registration-button").addEventListener("click", () => {
            window.location.href = "new-registration.html"; // Redirect to the new registration page
        });
    } catch (error) {
        console.error("Error loading dashboard:", error);
        alert("An error occurred while loading your dashboard. Please try again later.");
    }
}

async function safeJsonParse(response) {
    try {
        return await response.json();
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return null; // Return null if parsing fails
    }
}

// Load dashboard on page load
loadDashboard();

async function removeRegistration(registrationId) {
    try {
        console.log("Removing registration with ID:", registrationId); // Debugging

        const response = await fetch(`http://localhost:5089/api/Data/${registrationId}/3`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error removing registration:", errorText);
            alert(`Failed to remove registration: ${errorText}`);
            return; // Exit the function if the deletion fails
        }

        console.log("Registration removed successfully.");
        alert("Registration removed successfully!");

        // Reload the dashboard after successful deletion
        loadDashboard();
    } catch (error) {
        console.error("Error removing registration:", error);
        alert("An error occurred while removing the registration. Please try again later.");
    }
}

async function displayProducts() {
    try {
        // Fetch all products
        const response = await fetch(`http://localhost:5089/api/Data/2`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error fetching products:", errorText);
            alert(`Failed to fetch products: ${errorText}`);
            return;
        }

        const products = await response.json();
        console.log("Fetched products:", products);

        // Filter products for the logged-in vendor
        const vendorProducts = products.filter(
            (product) => product.vendorId === parseInt(vendorId)
        );
        console.log("Vendor's products:", vendorProducts);

        // Get the container for displaying products
        const productsList = document.getElementById("products-list");
        if (!productsList) {
            console.error("Error: #products-list element not found.");
            return;
        }

        // Render the products
        if (vendorProducts.length === 0) {
            productsList.innerHTML = "<li>No products found for this vendor.</li>";
        } else {
            productsList.innerHTML = vendorProducts
                .map(
                    (product) => `
                    <div class="product-box">
                        <h3>${product.name || "N/A"}</h3>
                        <p><strong>Description:</strong> ${product.description || "N/A"}</p>
                    </div>
                `
                )
                .join("");
        }
    } catch (error) {
        console.error("Error displaying products:", error);
        alert("An error occurred while displaying products. Please try again later.");
    }
}

// Call displayProducts on page load
displayProducts();

// Call displayProducts on page load
displayProducts();