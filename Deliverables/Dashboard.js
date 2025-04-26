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
                // Render the products
        if (vendorProducts.length === 0) {
            productsList.innerHTML = "<li>No products found for this vendor.</li>";
        } else {
            productsList.innerHTML = vendorProducts
                .map(
                    (product) => `
                        <div class="product-box" data-product-id="${product.id}">
                            <h3>${product.name || "N/A"}</h3>
                            <p><strong>Description:</strong> ${product.description || "N/A"}</p>
                            <button class="delete-product-button" data-product-id="${product.id}" style="
                                padding: 5px 10px;
                                background-color: #dc3545;
                                color: #fff;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: 14px;
                                margin-top: 10px;
                            ">Delete</button>
                        </div>
                    `
                )
                .join("");
        }
        
        // Add event listener for delete buttons
        productsList.addEventListener("click", (event) => {
            if (event.target.classList.contains("delete-product-button")) {
                const productId = event.target.getAttribute("data-product-id");
        
                // Simulate deleting a product (replace with API call)
                const productIndex = vendorProducts.findIndex((product) => product.id == productId);
                if (productIndex !== -1) {
                    vendorProducts.splice(productIndex, 1); // Remove the product from the array
                    displayProducts(); // Re-render the product list
                } else {
                    console.error("Product not found.");
                }
            }
        });

        // Create a container for error messages
        const errorContainer = document.createElement("div");
        errorContainer.id = "error-container";
        errorContainer.style.display = "none"; // Initially hidden
        errorContainer.style.color = "red";
        errorContainer.style.marginTop = "10px";
        errorContainer.style.fontSize = "14px";
        productsList.parentElement.appendChild(errorContainer);
        // Ensure the "Add Product" button is created only once
        let addProductButton = document.getElementById("add-product-button");
        if (!addProductButton) {
            addProductButton = document.createElement("button");
            addProductButton.textContent = "Add Product";
            addProductButton.id = "add-product-button";
            addProductButton.style.marginTop = "20px";
            addProductButton.style.padding = "10px 20px";
            addProductButton.style.backgroundColor = "#007bff";
            addProductButton.style.color = "#fff";
            addProductButton.style.border = "none";
            addProductButton.style.borderRadius = "5px";
            addProductButton.style.cursor = "pointer";
            addProductButton.style.fontSize = "16px";
            addProductButton.style.display = "block";
            addProductButton.style.marginLeft = "auto"; // Center horizontally
            addProductButton.style.marginRight = "auto"; // Center horizontally
            addProductButton.style.textAlign = "center";
        
            // Add hover effect for the button
            addProductButton.addEventListener("mouseover", () => {
                addProductButton.style.backgroundColor = "#0056b3";
            });
            addProductButton.addEventListener("mouseout", () => {
                addProductButton.style.backgroundColor = "#007bff";
            });
        
            // Append the button below the products list
            productsList.parentElement.appendChild(addProductButton);
        
            // Add event listener for the "Add Product" button
            addProductButton.addEventListener("click", () => {
                addProductForm.style.display = "block"; // Show the form
                addProductButton.style.display = "none"; // Hide the "Add Product" button
            });
        }
        // Add event listener for adding a product
        addProductButton.addEventListener("click", () => {
            addProductButton.style.display = "none"; // Hide the "Add Product" button
            // Create a form for adding a product
            const addProductForm = document.createElement("form");
            addProductForm.id = "add-product-form";
            addProductForm.style.marginTop = "20px";
            addProductForm.style.display = "none"; // Initially hidden
            
            // Create input for product name
            const productNameInput = document.createElement("input");
            productNameInput.type = "text";
            productNameInput.placeholder = "Enter product name";
            productNameInput.id = "product-name-input";
            productNameInput.style.marginRight = "10px";
            productNameInput.style.padding = "5px";
            productNameInput.style.border = "1px solid #ccc";
            productNameInput.style.borderRadius = "5px";
            
            // Create input for product description
            const productDescriptionInput = document.createElement("input");
            productDescriptionInput.type = "text";
            productDescriptionInput.placeholder = "Enter product description";
            productDescriptionInput.id = "product-description-input";
            productDescriptionInput.style.marginRight = "10px";
            productDescriptionInput.style.padding = "5px";
            productDescriptionInput.style.border = "1px solid #ccc";
            productDescriptionInput.style.borderRadius = "5px";
            
            // Create a submit button for the form
            const submitProductButton = document.createElement("button");
            submitProductButton.type = "submit";
            submitProductButton.textContent = "Submit Product";
            submitProductButton.style.padding = "5px 10px";
            submitProductButton.style.backgroundColor = "#007bff";
            submitProductButton.style.color = "#fff";
            submitProductButton.style.border = "none";
            submitProductButton.style.borderRadius = "5px";
            submitProductButton.style.cursor = "pointer";

            // Style the form for a vertical layout
            addProductForm.style.display = "flex";
            addProductForm.style.flexDirection = "column";
            addProductForm.style.alignItems = "center";
            addProductForm.style.gap = "15px"; // Add spacing between elements
            addProductForm.style.width = "100%";
            addProductForm.style.maxWidth = "400px";
            addProductForm.style.margin = "20px auto"; // Center the form horizontally

            // Style the product name input
            productNameInput.style.width = "100%";
            productNameInput.style.padding = "10px";
            productNameInput.style.fontSize = "16px";
            productNameInput.style.border = "1px solid #ccc";
            productNameInput.style.borderRadius = "5px";

            // Style the product description input
            productDescriptionInput.style.width = "100%";
            productDescriptionInput.style.padding = "10px";
            productDescriptionInput.style.fontSize = "16px";
            productDescriptionInput.style.border = "1px solid #ccc";
            productDescriptionInput.style.borderRadius = "5px";

            // Style the submit button
            submitProductButton.style.padding = "10px 20px";
            submitProductButton.style.fontSize = "16px";
            submitProductButton.style.backgroundColor = "#007bff";
            submitProductButton.style.color = "#fff";
            submitProductButton.style.border = "none";
            submitProductButton.style.borderRadius = "5px";
            submitProductButton.style.cursor = "pointer";
            submitProductButton.style.width = "100%"; // Make the button full width

            
            // Add hover effect for the submit button
            submitProductButton.addEventListener("mouseover", () => {
                submitProductButton.style.backgroundColor = "#0056b3";
            });
            submitProductButton.addEventListener("mouseout", () => {
                submitProductButton.style.backgroundColor = "#007bff";
            });
            
            // Append inputs and button to the form
            addProductForm.appendChild(productNameInput);
            addProductForm.appendChild(productDescriptionInput);
            addProductForm.appendChild(submitProductButton);
            
            // Append the form below the products list
            productsList.parentElement.appendChild(addProductForm);
            
            // Add event listener for the "Add Product" button to show the form
            addProductButton.addEventListener("click", () => {
                addProductForm.style.display = "block"; // Show the form
            });
            
            // Add event listener for the form submission
            addProductForm.addEventListener("submit", (event) => {
                event.preventDefault(); // Prevent the form from refreshing the page
            
                const productName = productNameInput.value.trim();
                const productDescription = productDescriptionInput.value.trim();
                console.log("Product Name:", productName);
                console.log("Product Description:", productDescription);
                if (productName && productDescription) {
                    // Simulate adding a product (replace with API call)
                    const newProduct = {
                        Name: productName,
                        Description: productDescription,
                        VendorId: parseInt(vendorId), // Use the vendor ID from localStorage
                    };
                    fetch("http://localhost:5089/api/Data/2", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newProduct),
                    })
                    .then(() => {
                        displayProducts(); // Re-render the products
                        errorContainer.style.display = "none"; // Hide error message if successful
                        addProductForm.style.display = "none"; // Hide the form after submission
                        productNameInput.value = ""; // Clear the input fields
                        productDescriptionInput.value = "";
                    })
                    .catch((error) => {
                        console.error("Error adding product:", error);
                        errorContainer.textContent = "Failed to add product. Please try again.";
                        errorContainer.style.display = "block";
                    });
                } else {
                    // Show error message in the error container
                    errorContainer.textContent = "Product name and description are required.";
                    errorContainer.style.display = "block";
                }
            });
        });
        
        // Add event listeners for deleting products
        productsList.addEventListener("click", (event) => {
            if (event.target.classList.contains("delete-product-button")) {
                const productId = event.target.getAttribute("data-product-id");
        
                fetch(`http://localhost:5089/api/Data/${productId}/2`, {
                    method: "Delete",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

            }
        });
    } catch (error) {
        console.error("Error displaying products:", error);
        alert("An error occurred while displaying products. Please try again later.");
    }
    
}




// Call displayProducts on page load
displayProducts();

