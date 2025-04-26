// Check login state before loading anything
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const vendorId = localStorage.getItem("vendorId");
    
    if (!isLoggedIn || !vendorId) {
        alert("Please log in to access this page.");
        window.location.href = "login.html";
        return;
    }
    
    // If logged in, load the events
});

async function loadEvents() {
        const eventsContainer = document.getElementById("events-container");
        if (!eventsContainer) {
            console.error("Error: #events-container element not found.");
            return;
        }
        const vendorId = localStorage.getItem("vendorId");
        if (!vendorId) {
            console.error("Vendor ID not found in localStorage.");
            return null;
        }
        header.innerHTML = `<h2>Events Available for Registration</h2>`;
        const eventsResponse = await fetch("http://localhost:5089/api/Data/1");
        const registrationsResponse = await fetch("http://localhost:5089/api/Data/3");
        const allRegistrations = await registrationsResponse.json();
        const vendorResponse = await fetch(`http://localhost:5089/api/Data/${vendorId}/0`);
        const vendor = await vendorResponse.json();

        const response =  await fetch("http://localhost:5089/api/Data/2");
        if (!response.ok) {
            throw new Error("Failed to fetch existing products");
        }
        const existingProductsData =  await response.json();
    
        // Filter products for the logged-in vendor
        const vendorProducts = existingProductsData.filter(
            (product) => product.vendorId === parseInt(vendorId)
        );




        // Filter registrations for the logged-in vendor
        const vendorRegistrations = allRegistrations.filter(
            (registration) => registration.vendorId === parseInt(vendorId)
        );

        let allEvents = await eventsResponse.json();
        allEvents = allEvents.filter((event) => {
            return !vendorRegistrations.some((registration) => registration.eventId === event.id);
        });
        const mainContainer = document.getElementById("main-container");
        // Debugging: Log filtered events
        if (!eventsContainer) {
            console.error("Error: #events-container element not found.");
            return;
        }

        if (allEvents.length === 0) {
            eventsContainer.innerHTML = "<p>No new events available.</p>";
        } else {
            allEvents.forEach((event) => {
                // Create a button for each event
                const button = document.createElement("button");
                button.className = "event-button"; // Add a class for styling
                button.textContent = `${event.name} - ${event.date} - ${event.location}`;
                button.value = event.id;
        
                // Add a click event listener to handle the button click
                button.addEventListener("click", () => {
                        // Clear any existing input box or message
                        const existingInputBox = document.getElementById("product-input-box");
                        if (existingInputBox) {
                            existingInputBox.remove();
                        }

                        // Create a container for the product input fields
                        const inputContainer = document.createElement("div");
                        inputContainer.id = "product-input-box";
                        inputContainer.style.marginTop = "10px";

                        // Create a label for the product dropdown
                        const productLabel = document.createElement("label");
                        productLabel.textContent = "Select an Existing Product or Create a New One:";
                        productLabel.style.display = "block";
                        productLabel.style.marginBottom = "5px";

                        // Create the product dropdown
                        const productDropdown = document.createElement("select");
                        productDropdown.style.width = "100%";
                        productDropdown.style.padding = "10px";
                        productDropdown.style.marginBottom = "10px";
                        productDropdown.style.fontSize = "16px";
                        
                        // Add a default option
                        const defaultOption = document.createElement("option");
                        defaultOption.textContent = "Select a product";
                        defaultOption.value = "1";
                        productDropdown.appendChild(defaultOption);

                        const noProductOption = document.createElement("option");
                        noProductOption.value = "";
                        noProductOption.textContent = "No Product";
                        productDropdown.appendChild(noProductOption);
                        
                        try {
                            // Fetch existing products from the AP
                        
                            // Populate the dropdown with existing products
                            vendorProducts.forEach((product) => {
                                const option = document.createElement("option");
                                option.textContent = product.name;
                                option.value = product.id;
                                productDropdown.appendChild(option);
                            });
                        } catch (error) {
                            console.error("Error fetching products:", error);
                        }

                        // Add an option to create a new product
                        const createNewOption = document.createElement("option");
                        createNewOption.textContent = "Create New Product";
                        createNewOption.value = "new";
                        productDropdown.appendChild(createNewOption);

                        // Create a container for the new product input fields
                        const newProductContainer = document.createElement("div");
                        newProductContainer.style.display = "none"; // Initially hidden

                        // Create a label for the product name
                        const nameLabel = document.createElement("label");
                        nameLabel.textContent = "Product Name:";
                        nameLabel.style.display = "block";
                        nameLabel.style.marginBottom = "5px";

                        // Create the product name input field
                        const nameInput = document.createElement("input");
                        nameInput.type = "text";
                        nameInput.placeholder = "Enter product name";
                        nameInput.style.width = "100%";
                        nameInput.style.padding = "10px";
                        nameInput.style.marginBottom = "10px";
                        nameInput.style.fontSize = "16px";

                        // Create a label for the product description
                        const descriptionLabel = document.createElement("label");
                        descriptionLabel.textContent = "Product Description:";
                        descriptionLabel.style.display = "block";
                        descriptionLabel.style.marginBottom = "5px";

                        // Create the product description input field
                        const descriptionInput = document.createElement("textarea");
                        descriptionInput.placeholder = "Enter product description";
                        descriptionInput.style.width = "100%";
                        descriptionInput.style.padding = "10px";
                        descriptionInput.style.marginBottom = "10px";
                        descriptionInput.style.fontSize = "16px";
                        descriptionInput.style.height = "100px";

                        // Append the new product input fields to the container
                        newProductContainer.appendChild(nameLabel);
                        newProductContainer.appendChild(nameInput);
                        newProductContainer.appendChild(descriptionLabel);
                        newProductContainer.appendChild(descriptionInput);

                        // Add a change event listener to the dropdown
                        productDropdown.addEventListener("change", () => {
                            if (productDropdown.value === "new") {
                                // Show the new product input fields
                                newProductContainer.style.display = "block";
                            } else {
                                // Hide the new product input fields
                                newProductContainer.style.display = "none";
                            }
                        });

                        // Create the confirmation button
                        const confirmButton = document.createElement("button");
                        confirmButton.textContent = "Confirm";
                        confirmButton.style.padding = "10px 20px";
                        confirmButton.style.fontSize = "16px";
                        confirmButton.style.backgroundColor = "#007bff";
                        confirmButton.style.color = "white";
                        confirmButton.style.border = "none";
                        confirmButton.style.borderRadius = "5px";
                        confirmButton.style.cursor = "pointer";

                        // Add a click event listener to the confirm button
                        confirmButton.addEventListener("click", () => {
                            const selectedProductId = productDropdown.value;
                            const productName = nameInput.value.trim() || productDropdown.options[productDropdown.selectedIndex].text;
                            const productDescription = descriptionInput.value.trim();

                            if (selectedProductId === "new") {
                                // Handle new product creation
                                console.log(`New Product Name: ${productName}`);
                                console.log(`New Product Description: ${productDescription}`);
                            } else if (selectedProductId) {
                                // Handle existing product selection
                                console.log(`Selected Product ID: ${selectedProductId}`);
                            }else{
                                alert("Please select an option");
                            }
                        });

                        // Append elements to the input container
                        inputContainer.appendChild(productLabel);
                        inputContainer.appendChild(productDropdown);
                        inputContainer.appendChild(newProductContainer);
                        inputContainer.appendChild(confirmButton);

                        // Insert the input container directly below the event button
                        button.insertAdjacentElement("afterend", inputContainer);
                    

                    // Append the button to the events container
                    eventsContainer.appendChild(button);
                    confirmButton.addEventListener("click", () => {
                        if (nameInput)handleProductSubmission(event.name, descriptionInput.value, nameInput.value, parseInt(vendorId));
                        // Clear the screen by replacing the content of #main-container
                        mainContainer.innerHTML = ""; // Clear all content
                        eventsContainer.innerHTML = ""; // Clear events container
                        header.innerHTML = `<h2>Registration Checkout</h2>`; // Clear header
                        // Get event and product details
                        const selectedEvent = { name: event.name, fee: 50 }; // Replace with actual event details
                        const productName = nameInput.value || productDropdown.options[productDropdown.selectedIndex].text;
                    
                        // Create confirmation details
                        const confirmationContainer = document.createElement("div");
                        confirmationContainer.id = "confirmation-container";
                    
                        const eventDetails = document.createElement("p");
                        eventDetails.textContent = `Event: ${selectedEvent.name}`;
                    
                        const productDetails = document.createElement("p");
                        productDetails.textContent = `Product: ${productName}`;
                    
                        const feeDetails = document.createElement("p");
                        feeDetails.textContent = `Registration Fee: $${selectedEvent.fee}`;
                    
                        // Create the payment form
                        const paymentForm = document.createElement("form");
                        paymentForm.id = "payment-form";
                        paymentForm.style.display = "flex";
                        paymentForm.style.flexDirection = "column";
                        paymentForm.style.alignItems = "center";
                        paymentForm.style.justifyContent = "center";
                        paymentForm.style.marginTop = "20px";
                        paymentForm.style.padding = "20px";
                        paymentForm.style.border = "1px solid #ccc";
                        paymentForm.style.borderRadius = "10px";
                        paymentForm.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                        paymentForm.style.width = "300px";
                        paymentForm.style.backgroundColor = "#f9f9f9";

                        // Credit Card Number
                        const cardNumberLabel = document.createElement("label");
                        cardNumberLabel.textContent = "Credit Card Number:";
                        cardNumberLabel.style.marginBottom = "5px";
                        const cardNumberInput = document.createElement("input");
                        cardNumberInput.type = "text";
                        cardNumberInput.id = "card-number";
                        cardNumberInput.placeholder = "1234 5678 9012 3456";
                        cardNumberInput.style.marginBottom = "15px";
                        cardNumberInput.style.padding = "10px";
                        cardNumberInput.style.width = "100%";
                        cardNumberInput.style.border = "1px solid #ccc";
                        cardNumberInput.style.borderRadius = "5px";

                        // Expiration Date
                        const expirationLabel = document.createElement("label");
                        expirationLabel.textContent = "Expiration Date (MM/YY):";
                        expirationLabel.style.marginBottom = "5px";
                        const expirationInput = document.createElement("input");
                        expirationInput.type = "text";
                        expirationInput.id = "expiration-date";
                        expirationInput.placeholder = "MM/YY";
                        expirationInput.style.marginBottom = "15px";
                        expirationInput.style.padding = "10px";
                        expirationInput.style.width = "100%";
                        expirationInput.style.border = "1px solid #ccc";
                        expirationInput.style.borderRadius = "5px";

                        // CVV
                        const cvvLabel = document.createElement("label");
                        cvvLabel.textContent = "CVV:";
                        cvvLabel.style.marginBottom = "5px";
                        const cvvInput = document.createElement("input");
                        cvvInput.type = "text";
                        cvvInput.id = "cvv";
                        cvvInput.placeholder = "123";
                        cvvInput.style.marginBottom = "15px";
                        cvvInput.style.padding = "10px";
                        cvvInput.style.width = "100%";
                        cvvInput.style.border = "1px solid #ccc";
                        cvvInput.style.borderRadius = "5px";

                        // ZIP Code
                        const zipLabel = document.createElement("label");
                        zipLabel.textContent = "ZIP Code:";
                        zipLabel.style.marginBottom = "5px";
                        const zipInput = document.createElement("input");
                        zipInput.type = "text";
                        zipInput.id = "zip-code";
                        zipInput.placeholder = "12345";
                        zipInput.style.marginBottom = "15px";
                        zipInput.style.padding = "10px";
                        zipInput.style.width = "100%";
                        zipInput.style.border = "1px solid #ccc";
                        zipInput.style.borderRadius = "5px";

                        // Submit Button
                        const payButton = document.createElement("button");
                        payButton.type = "submit";
                        payButton.textContent = "Pay";
                        payButton.style.padding = "10px 20px";
                        payButton.style.backgroundColor = "#007bff";
                        payButton.style.color = "#fff";
                        payButton.style.border = "none";
                        payButton.style.borderRadius = "5px";
                        payButton.style.cursor = "pointer";
                        payButton.style.fontSize = "16px";
                        payButton.style.marginTop = "10px";
                        payButton.style.width = "100%";

                        // Add hover effect for the button
                        payButton.addEventListener("mouseover", () => {
                            payButton.style.backgroundColor = "#0056b3";
                        });
                        payButton.addEventListener("mouseout", () => {
                            payButton.style.backgroundColor = "#007bff";
                        });

                        // Append elements to the payment form
                        paymentForm.appendChild(eventDetails);
                        paymentForm.appendChild(productDetails);
                        paymentForm.appendChild(feeDetails);
                        paymentForm.appendChild(cardNumberLabel);
                        paymentForm.appendChild(cardNumberInput);
                        paymentForm.appendChild(document.createElement("br"));
                        paymentForm.appendChild(expirationLabel);
                        paymentForm.appendChild(expirationInput);
                        paymentForm.appendChild(document.createElement("br"));
                        paymentForm.appendChild(cvvLabel);
                        paymentForm.appendChild(cvvInput);
                        paymentForm.appendChild(document.createElement("br"));
                        paymentForm.appendChild(zipLabel);
                        paymentForm.appendChild(zipInput);
                        paymentForm.appendChild(document.createElement("br"));
                        paymentForm.appendChild(payButton);
                        // Append the payment form to the main container
                        mainContainer.appendChild(paymentForm);


                        paymentForm.addEventListener("submit", (e) => {
                            e.preventDefault(); // Prevent form submission
                        
                            const cardNumber = cardNumberInput.value.replace(/\s+/g, ""); // Remove spaces
                            const expirationDate = expirationInput.value;
                            const cvv = cvvInput.value;
                            const zip = zipInput.value;
                        
                            // Validate credit card number using Luhn algorithm
                            if (!validateCardNumber(cardNumber)) {
                                alert("Invalid credit card number.");
                                return;
                            }
                        
                            // Validate expiration date
                            if (!validateExpirationDate(expirationDate)) {
                                alert("Invalid or expired expiration date.");
                                return;
                            }
                        
                            // Validate CVV
                            if (!/^\d{3,4}$/.test(cvv)) {
                                alert("Invalid CVV. It must be 3 or 4 digits.");
                                return;
                            }
                        
                            // Validate ZIP code
                            if (!/^\d{5}$/.test(zip)) {
                                alert("Invalid ZIP code. It must be 5 digits.");
                                return;
                            }
                            registrationSubmit(event.id, nameInput.value, productDropdown.value,parseInt(vendorId));
                            alert("Payment successful! Thank you for registering.");
                            mainContainer.innerHTML = "Registration Confirmed!"; // Clear all content
                        });

                            // Append the payment form to the confirmation container
                            // Append the payment form to the confirmation container
                            const paymentContainer = document.getElementById("main-container");
                            if (paymentContainer) {
                                paymentContainer.appendChild(paymentForm); // Use the correct variable
                            } else {
                                console.error("Error: #main-container element not found.");
                            }
                        
                        });
                    ;

                    // Append the container to the events container
                    if (eventsContainer) {
                        eventsContainer.appendChild(inputContainer);
                    } else {
                        console.error("Error: #events-container element not found.");
                    }
                });
        
                // Append the button to the events container
                eventsContainer.appendChild(button);
            })};
        }

// Update handleProductSubmission to accept arguments
function handleProductSubmission(event, textBox, namebox, vendorId) {
    const productName = namebox; // Get the value from namebox
    const productDescription = textBox; // Get the value from textBox
    console.log("Product Name:", productName);
    console.log("Product Description:", productDescription);
    if (productName) {
        alert(`You selected: ${event} with product: ${productName} and description: ${productDescription}`);
    } else {
    }

    if (productName !== "") {
        product = {
            Name: productName,
            Description: productDescription,
            VendorId: vendorId,
        };
    }
    else {
        return;
    }

    // If a product is defined, send it to the server
    if (product) {
        fetch("http://localhost:5089/api/Data/2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        })
            .then((response) => {
                if (!response.ok) {
                    console.error("Failed to submit product:", response.statusText);
                } else {
                    console.log("Product submitted successfully!");
                }
            })
            .catch((error) => {
                console.error("Error during fetch:", error);
            });
    }
}

// Call the async function where appropriate


// Add a submit button event listener
// Create payment input form

// Handle payment submission


// Validation Functions
function validateCardNumber(cardNumber) {
    const sanitizedCardNumber = cardNumber.replace(/\s/g, '');

    if (!/^\d+$/.test(sanitizedCardNumber)) {
        return false;
    }

    let sum = 0;
    let isSecond = false;

    for (let i = sanitizedCardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitizedCardNumber.charAt(i), 10);

        if (isSecond) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        isSecond = !isSecond;
    }
    return (sum % 10 === 0);
}

function validateExpirationDate(expirationDate) {
    const [month, year] = expirationDate.split("/").map((val) => parseInt(val, 10));
    if (!month || !year || month < 1 || month > 12) return false;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-based
    const currentYear = parseInt(currentDate.getFullYear().toString().slice(-2)); // Last 2 digits of year

    // Check if the expiration date is in the past
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false;
    }

    return true;
}

async function registrationSubmit(eventid, productName, exisitingProduct, vendorId) {
    // Get the product data from the API
    const productResponse = await fetch("http://localhost:5089/api/Data/2");
    const productData = await productResponse.json();
    let productId = null; // Initialize productId to null
    if (exisitingProduct === "new") {
        productId = -1; // Use let instead of const
        productData.forEach((product) => {
            if (productName === product.name) {
                productId = product.id; // Reassignment is now allowed
                console.log("Product ID found:", productId);
            }
        }); 
    }
    else {
        productId = exisitingProduct;
    }


    const eventId = eventid;
    const registration = {
        VendorId: vendorId, // Fixed Int.parse to parseInt
        EventId: parseInt(eventId),  // Fixed Int.parse to parseInt
        ProductId: parseInt(productId)  || null, // Fixed Int.parse to parseInt
    };

    await fetch("http://localhost:5089/api/Data/3", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registration),
    })
    .then((response) => {
        if (response.ok) {
            console.log("Registration successful!");
        } else {
            console.error("Failed to register:", response.statusText);
        }
    })
    .catch((error) => {
        console.error("Error during registration:", error);
    });
}



// Handle payment submission
