// Function to handle sign-up form submission
async function handleSignUp(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Validate the password
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Regular expression for password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

    // Check if the password meets the requirements
    if (!passwordRegex.test(password)) {
        alert(
            "Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
        return;
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    // Collect form data
    const name = document.getElementById("name").value.trim();
    const type = document.getElementById("type").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const website = document.getElementById("website").value.trim();
    const username = document.getElementById("username").value.trim();

    // API endpoint for creating a new vendor
    const apiEndpoint = "http://localhost:5089/api/Data/0";

    // Create the vendor object
    const vendor = {
        Name: name,
        Type: type,
        Address: address,
        Phone: phone,
        Email: email,
        Website: website,
        Username: username,
        Password: password,
    };

    console.log(vendor);

    try {
        // Send a POST request to the API
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(vendor),
        });
        
        console.log(vendor);
        // Handle the API response
        if (response.ok) {
            alert("Vendor account created successfully!");
            // Redirect to the login page
        } else {
            // Check if the response is JSON or plain text
            const contentType = response.headers.get("Content-Type");
            let errorMessage;

            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || "Failed to create vendor account.";
            } else {
                const errorText = await response.text();
                errorMessage = errorText || "Failed to create vendor account.";
            }

            alert(`Error: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error during sign-up:", error);
        alert("An error occurred while creating the vendor account. Please try again later.");
    }
}

// Attach the sign-up handler to the form
document.querySelector(".form").addEventListener("submit", handleSignUp);