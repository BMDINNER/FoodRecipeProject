// Checks and applies guest mode on page load
function applyGuestMode() {
    if (sessionStorage.getItem('guestMode') === 'true') {
        document.body.classList.add('guest-mode');
        
        // Hides guest button if we're already in guest mode
        const guestButton = document.getElementById('guest-button');
        if (guestButton) guestButton.style.display = 'none';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const guestButton = document.getElementById('guest-button');
    
    // Only adds click handler if button exists (inside the login page)
    if (guestButton) {
        guestButton.addEventListener('click', function() {
            // Enables guest mode
            sessionStorage.setItem('guestMode', 'true');
            
            // Redirects to index.html
            window.location.href = 'index.html';
        });
    }
    
    // Applies guest mode styling
    applyGuestMode();
});