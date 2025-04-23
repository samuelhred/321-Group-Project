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

function openModal(eventElement) {
    // Retrieve data from the clicked event element
    const title = eventElement.getAttribute('data-title');
    const description = eventElement.getAttribute('data-description');

    // Set the modal content
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDescription').innerText = description;

    // Display the modal
    const modal = document.getElementById('eventModal');
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('eventModal').style.display = "none";
}

const url = `http://localhost:5089/api/Data/1`

async function handleOnLoad() {
    const eventContainer = document.getElementById('eventContainer');

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }

        const events = await response.json();

        eventContainer.innerHTML = '';

        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.setAttribute('data-title', event.name);
            eventDiv.setAttribute('data-date', event.date);
            eventDiv.setAttribute('data-location', event.location);
            eventDiv.onclick = () => openModal(eventDiv);
            eventDiv.innerHTML = `
                <div class="event-info">
                    <p><strong>${event.name}</strong></p>
                    <p>${event.date}</p>
                    <p>${event.location}</p>
                </div>
            `;
            eventContainer.appendChild(eventDiv);
        });
    } catch (error) {
        console.error('Error loading events:', error);
        eventContainer.innerHTML = '<p>Failed to load events. Please try again later.</p>';
    }
}