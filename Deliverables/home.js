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

    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDescription').innerHTML = `
        <button class="register-btn" onclick="handleRegister('${title}')">Register</button>
    `;

    const modal = document.getElementById('eventModal');
    modal.style.display = 'block';

    // Add click event listener to the modal background
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Store the currently open event for reference
    window.currentOpenEvent = eventElement;
}

function closeModal() {
    const modal = document.getElementById('eventModal');
    modal.style.display = "none";
    window.currentOpenEvent = null;
}

function toggleModal(eventElement) {
    const modal = document.getElementById('eventModal');
    
    if (modal.style.display === 'block') {
        // If clicking the same event that's currently shown, close the modal
        if (window.currentOpenEvent === eventElement) {
            closeModal();
        } else {
            // If clicking a different event, update the modal content
            openModal(eventElement);
        }
    } else {
        openModal(eventElement);
    }
}

function handleRegister(eventTitle) {
    // You can add registration logic here
    console.log(`Registering for event: ${eventTitle}`);
    // For now, just close the modal
    closeModal();
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