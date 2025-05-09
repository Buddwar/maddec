document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // validate credentials against backend
    console.log('Login attempt:', { username, password });
    
    // Redirect to subscription page after successful login
    window.location.href = 'subscription.html';
});