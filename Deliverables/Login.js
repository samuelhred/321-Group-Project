// Function to handle login
async function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    // Get the username and password from the form
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // API endpoint for fetching vendors
    const link = "http://localhost:5089/api/Data/0"; // Replace with your actual API endpoint

    try {
        // Make a GET request to the API to fetch vendors
        const response = await fetch(link, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Parse the JSON response
        const vendors = await response.json();
        console.log(vendors);

        if (response.ok) {
            // Check if the username and password match any vendor
            const vendor = vendors.find(
                (v) => v.username === username && v.password === password
            );

            if (vendor) {
                // Login successful
                alert("Login successful! Welcome, " + vendor.username + ".");
                // Redirect to the vendor dashboard or another page
                window.location.href = "home.html";
            } else {
                // Login failed
                alert("Invalid username or password. Please try again.");
            }
        } else {
            // Handle API errors
            alert("Failed to fetch vendor data. Please try again later.");
        }
    } catch (error) {
        // Handle network or server errors
        console.error("Error during login:", error);
        alert("An error occurred while trying to log in. Please try again later.");
    }
}

// Attach the login handler to the form
document.querySelector(".form").addEventListener("submit", handleLogin);