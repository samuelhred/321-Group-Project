async function loadEvents() {
        const vendorId = localStorage.getItem("vendorId");
        if (!vendorId) {
            console.error("Vendor ID not found in localStorage.");
            return null;
        }
        header.innerHTML = `<h2>Events Avaliblie for Registration</h2>`;
        const eventsResponse = await fetch("http://localhost:5089/api/Data/1");
        const registrationsResponse = await fetch("http://localhost:5089/api/Data/3");
        const allRegistrations = await registrationsResponse.json();
        const vendorResponse = await fetch(`http://localhost:5089/api/Data/${vendorId}/0`);
        const vendor = await vendorResponse.json();
        console.log("All Registrations:", allRegistrations);
        console.log("Vendor Info:", vendor);



        // Filter registrations for the logged-in vendor
        const vendorRegistrations = allRegistrations.filter(
            (registration) => registration.vendorId === parseInt(vendorId)
        );

        let allEvents = await eventsResponse.json();
        allEvents = allEvents.filter((event) => {
            return !vendorRegistrations.some((registration) => registration.eventId === event.id);
        });
        console.log("All Events:", allEvents);

        // Debugging: Log filtered events
        console.log("Filtered Events:", allEvents);

        const eventsContainer = document.getElementById("events-container");
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
        
                    // Create a container for the input box and confirmation button
                    const inputContainer = document.createElement("div");
                    inputContainer.id = "product-input-box";
                    inputContainer.style.marginTop = "20px";
        
                    // Create a label for the text box
                    const label = document.createElement("label");
                    label.textContent = `Specify a product for ${event.name} (optional):`;
                    label.style.display = "block";
                    label.style.marginBottom = "10px";

                    // Create the text box
                    const namebox = document.createElement("input");
                    namebox.type = "text"; // Error: textBox is not defined yet
                    namebox.placeholder = "Enter product Name";
                    namebox.style.marginRight = "10px";
        
                    // Create the text box
                    const textBox = document.createElement("input");
                    textBox.type = "text";
                    textBox.placeholder = "Enter desccription";
                    textBox.style.marginRight = "10px";
        
                    // Create the confirmation button
                    const confirmButton = document.createElement("button");
                    confirmButton.textContent = "Confirm";
                    confirmButton.style.marginTop = "10px";
        
                    // Add an event listener to the confirmation button

        
                    // Append the label, text box, and button to the container
                    inputContainer.appendChild(label);
                    inputContainer.appendChild(namebox);
                    inputContainer.appendChild(textBox);
                    inputContainer.appendChild(confirmButton);

                    confirmButton.addEventListener("click", () => {
                        handleProductSubmission(event.name, textBox.value.trim(), namebox.value.trim(), parseInt(vendorId));
                            // Clear the screen by replacing the content of #main-container
                            let mainContainer = document.getElementById("main-container");
                            mainContainer.innerHTML = ""; // Clear all content
                            eventsContainer.innerHTML = ""; // Clear events container
                            header.innerHTML = `<h2>Registration Checkout</h2>`; // Clear header
                            // Get event and product details
                            const selectedEvent = { name: event.name, fee: 50 }; // Replace with actual event details
                            const productName = namebox.value || "No product entered";
                        
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
                                registrationSubmit(event.id, namebox.value.trim(),parseInt(vendorId));
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
                    const eventsContainer = document.getElementById("events-container");
                    if (eventsContainer) {
                        eventsContainer.appendChild(inputContainer);
                    } else {
                        console.error("Error: #events-container element not found.");
                    }
                });
        
                // Append the button to the events container
                eventsContainer.appendChild(button);
            });
        }
    }

// Update handleProductSubmission to accept arguments
function handleProductSubmission(event, textBox, namebox, vendorId) {
    const productName = namebox; // Get the value from namebox
    const productDescription = textBox; // Get the value from textBox

    if (productName) {
        alert(`You selected: ${event} with product: ${productName} and description: ${productDescription}`);
    } else {
        alert(`You selected: ${event} without specifying a product.`);
    }

    // Create a product object if namebox has a value
    let product = null;
    if (productName !== "") {
        product = {
            Name: productName,
            Description: productDescription,
            VendorId: vendorId,
        };
    }
    console.log("Product object:", product);

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
    if (!/^\d{16}$/.test(cardNumber)) return false; // Check if the card number is 16 digits
    else return true;
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

async function registrationSubmit(eventid, productName, vendorId) {
    // Get the product data from the API
    const productResponse = await fetch("http://localhost:5089/api/Data/2");
    const productData = await productResponse.json();

    let productId = -1; // Use let instead of const
    productData.forEach((product) => {
        if (productName === product.name) {
            productId = product.id; // Reassignment is now allowed
            console.log("Product ID found:", productId);
        }
    });

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
