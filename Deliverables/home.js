// Check user session on page load
document.addEventListener('DOMContentLoaded', function() {
    const userRole = localStorage.getItem('user_role');
    const bookingLink = document.getElementById('booking-link');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const logoutButton = document.getElementById('logout-button');

    console.log('Current user role:', userRole);

    if (userRole === 'vendor') {
        // Show booking link and logout, hide login link for vendors
        bookingLink.style.display = 'block';
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else if (userRole === 'admin') {
        // Hide booking and login links, show logout for admin
        bookingLink.style.display = 'none';
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        // Show login link, hide booking and logout for non-logged in users
        bookingLink.style.display = 'none';
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }

    // Add logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear session data
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_role');
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
});

// Fetch and display events
function openModal(eventElement) {
    // Retrieve data from the clicked event element
    const title = eventElement.getAttribute('data-title');
    const description = eventElement.getAttribute('data-description');

    // Set the modal content
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDescription').innerText = description;

    // Get the event container position
    const eventContainer = document.getElementById('events');
    const rect = eventContainer.getBoundingClientRect();

    // Position the modal to the right of the event container
    const modal = document.getElementById('eventModal');
    modal.style.display = "block";
    modal.style.top = `${rect.top + window.scrollY + rect.height / 2 - modal.offsetHeight / 2}px`;
    modal.style.left = `${rect.right + 20}px`; // 20px gap from the event container
}

function closeModal() {
    document.getElementById('eventModal').style.display = "none";
}

function displayEvents(id) {
    currentEvent = myEvents.find(r => r.id == id)
    const eventData = document.getElementById('eventData')
    
    eventData.innerHTML = `
    <strong>Event Name:</strong> ${currentEvent.Name}<br>
    <strong>Event Date:</strong> ${currentEvent.Date}<br>
    <strong>Event Location:</strong> ${currentEvent.Location}<br>
    `;
}