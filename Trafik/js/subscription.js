  // Function to show success message
  function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Save button click handler
document.getElementById('save-button').addEventListener('click', () => {
    const frequency = document.getElementById('update-frequency').value;
    
    //  send this to backend
    console.log('Saving new frequency:', frequency);
    
    // Show success message
    showSuccessMessage();
});

// Cancel button click handler
document.getElementById('cancel-button').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Load user data (this would come from backend)
window.addEventListener('load', () => {
    // This is where we would fetch the user's current subscription data
    // For demo purposes, we're using hardcoded values
    const userData = {
        name: 'Test Name',
        email: 'test@example.com',
        phone: '070-123 45 67',
        state: 'Stockholms län',
        frequency: 'daily'
    };

    document.getElementById('subscriber-name').textContent = userData.name;
    document.getElementById('subscriber-email').textContent = userData.email;
    document.getElementById('subscriber-phone').textContent = userData.phone;
    document.getElementById('subscriber-state').textContent = userData.state;
    document.getElementById('update-frequency').value = userData.frequency;
});


async function get_user_details(email){
    data = {'email': email};
    let response = await fetch('https://bergstrom.pythonanywhere.com/get_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },//Här skickar med vår sessionscookie från serversidan
        //o det är ju då för att kontrollera VEM det är som är inloggad
        credentials: 'include'
    });
    let jsonResult = await response.json();
}