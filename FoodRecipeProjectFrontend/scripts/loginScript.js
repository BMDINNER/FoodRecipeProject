document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const messageEl = document.getElementById('login-message');

  loginButton.addEventListener('click', async () => {
    const username = document.getElementById('username-field').value;
    const password = document.getElementById('password-field').value;

    // Clear previous messages
    messageEl.innerHTML = '';
    messageEl.className = 'message';

    if (!username || !password) {
      showMessage('&#10060; Please enter both fields', 'error'); 
      return;
    }

    try {
      loginButton.disabled = true;
      loginButton.textContent = 'Authenticating...';

      const response = await fetch('http://localhost:3500/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login Failed');
      }

      const data = await response.json();

      if (response.ok) {
        showMessage('&#9989; Login successful!', 'success'); 
        
        sessionStorage.setItem('tempToken', data.accessToken);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      } else {
        showMessage(`&#10060; ${data.message || 'Login failed'}`, 'error'); 
      }
    } catch (error) {
      console.error('MongoDB connection error:', error);
      showMessage('&#9888;&#65039; Database unavailable. Try later.', 'error'); 
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = 'Login';
    }
  });

  function showMessage(html, type) {
    messageEl.innerHTML = html; // Changed to innerHTML
    messageEl.className = `message ${type}`;
  }
});