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
    const title = eventElement.getAttribute('data-title');
    const description = eventElement.getAttribute('data-description');

    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDescription').innerText = description;

    const modal = document.getElementById('eventModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('eventModal');
    modal.style.display = "none";
}

function toggleModal(eventElement) {
    const modal = document.getElementById('eventModal');
    if (modal.style.display === 'block') {
        closeModal();
    } else {
        openModal(eventElement);
    }
}

const url = `http://localhost:5089/api/Data/1`

async function handleOnLoad() {
    const eventContainer = document.getElementById('eventContainer');

    const eventDescriptions = {
        "test": "Annual spring fesival celebrating local culture.",
        "test2": "Explore the wonders of the universe at this science fair.",
        "test3": "Join us for a day of fun and games at the community center.",
    };

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

            const description = eventDescriptions[event.name] || "No description currently available for this event.";
            eventDiv.setAttribute('data-description', description);

            eventDiv.onclick = () => toggleModal(eventDiv);

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