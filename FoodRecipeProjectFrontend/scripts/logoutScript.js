document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:3500/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Logout failed');
            
            // Clear frontend storage
            sessionStorage.clear();
            // Redirect to login page
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed - please try again');
        }
    });
});