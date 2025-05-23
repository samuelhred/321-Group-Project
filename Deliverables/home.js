// Check user session on page load
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('user_role');
    const username = localStorage.getItem('username');
    const dashboardLink = document.getElementById('dashboard-link');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const logoutButton = document.getElementById('logout-button');
    const userWelcome = document.getElementById('user-welcome');

    console.log('Login status:', isLoggedIn);
    console.log('Current user role:', userRole);

    if (isLoggedIn === 'true' && userRole === 'vendor') {
        // Show booking link and logout, hide login link for vendors
        if (dashboardLink) dashboardLink.style.display = 'block';
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        if (userWelcome) userWelcome.textContent = `Welcome, ${username || 'Vendor'}!`;
    } else if (isLoggedIn === 'true' && userRole === 'admin') {
        // Hide booking and login links, show logout for admin
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        if (userWelcome) userWelcome.textContent = `Welcome, Admin!`;
    } else {
        // Show login link, hide booking and logout for non-logged in users
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (userWelcome) userWelcome.textContent = '';
    }

    // Add logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear all session data
            localStorage.removeItem('vendorId');
            localStorage.removeItem('user_role');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            // Redirect to home page
            window.location.href = 'home.html';
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
    // Check login status from localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('user_role');

    if (isLoggedIn === 'true' && userRole === 'vendor') {
        // If logged in as vendor, redirect to new registration page
        window.location.href = 'new-registration.html';
    } else {
        // If not logged in, show alert and redirect to login page
        alert("You must be logged in as a vendor to register for events. Redirecting to login page...");
        window.location.href = 'login.html';
    }
    
    // Close the modal before redirecting
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