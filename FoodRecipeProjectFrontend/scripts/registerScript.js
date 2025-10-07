document.addEventListener('DOMContentLoaded', () => {
  const registerButton = document.getElementById('register-button');
  const usernameInput = document.getElementById('username-field');
  const passwordInput = document.getElementById('password-field');
  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  usernameInput.parentNode.insertBefore(messageElement, usernameInput);

  registerButton.addEventListener('click', async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Clear previous messages
    messageElement.innerHTML = ''; // Changed to innerHTML
    messageElement.className = 'message';

    if (!username || !password) {
      showMessage('&#10060; Please enter both username and password', 'error'); 
      return;
    }

    try {
      console.log('Attempting to register:', username);
      registerButton.disabled = true;
      registerButton.textContent = 'Registering...';

      const response = await fetch('http://localhost:3500/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok) {
        showMessage(`&#9989; Registration successful! Welcome ${data.user.username}`, 'success'); 
        
        // Clear form after 3 seconds
        setTimeout(() => {
          usernameInput.value = '';
          passwordInput.value = '';
          messageElement.innerHTML = '';
          messageElement.className = 'message';
        }, 3000);
      } else {
        showMessage(`&#10060; ${data.message}`, 'error'); 
      }
    } catch (error) {
      console.error('Registration error:', error);
      showMessage('&#9888;&#65039; Network error. Please try again.', 'error');
    } finally {
      registerButton.disabled = false;
      registerButton.textContent = 'Register';
    }
  });

  function showMessage(html, type) {
    messageElement.innerHTML = html; // Changed to innerHTML
    messageElement.className = `message ${type}`;
  }
});