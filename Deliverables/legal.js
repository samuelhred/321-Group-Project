document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.legal-nav a');
    const footerLinks = document.querySelectorAll('.footer-right a');
    const sections = document.querySelectorAll('.legal-section');
    
    // Function to toggle sections
    function toggleSection(sectionId) {
        // Remove active class from all sections and links
        sections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to selected section and link
        const selectedSection = document.getElementById(sectionId);
        const selectedLink = document.querySelector(`.legal-nav a[href="#${sectionId}"]`);
        
        if (selectedSection && selectedLink) {
            selectedSection.classList.add('active');
            selectedLink.classList.add('active');
        }
    }
    

    // Add click event listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            toggleSection(sectionId);
            // Update URL hash without scrolling
            history.pushState(null, null, `#${sectionId}`);
        });
    });

    // Add click event listeners to footer links
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').split('#')[1];
            if (sectionId) {
                toggleSection(sectionId);
                // Update URL hash without scrolling
                history.pushState(null, null, `#${sectionId}`);
            }
        });
    });

    // Check URL hash on page load
    const hash = window.location.hash.substring(1);
    if (hash) {
        toggleSection(hash);
    } else {
        // Default to terms if no hash
        toggleSection('terms');
    }
}); 