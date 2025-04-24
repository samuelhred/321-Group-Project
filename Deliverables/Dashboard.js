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

        document.getElementById("vendor-info").innerHTML = `
            <h3>Welcome, ${vendor.name}</h3>
        `;

        // Filter registrations for the logged-in vendor
        const vendorRegistrations = allRegistrations.filter(
            (registration) => registration.vendorId === parseInt(vendorId)
        );
        console.log("All Registrations:", vendorRegistrations);
        // Add event details to registrations
        vendorRegistrations.forEach((registration) => {
            const event = allEvents.find((event) => event.id === registration.eventId);
            if (event) {
                registration.eventName = event.name;
                registration.Date = event.date;
                registration.location = event.location;
            }
        });
        console.log("Vendor Registrations:", vendorRegistrations);

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
                    </div>
                `
                )
                .join("");
        }

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