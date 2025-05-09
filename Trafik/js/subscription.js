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
    /*Detta är den data som behöver sparas 
    undan för respektive prenumerant*/
    let data = {
    'email': 'h23anber@du.se',
    'passw': 'hunter23',
    'fname': 'Andreas',
    'lname': 'Bergström',
    'phone': '0761234567',
    'start': '2025-03-24',//dagens datum
    'subtype': 'weekly',
    'paymethod': 'Creditcard',
    'countrycode': '14',
    'orgnr': '5512345679',//Organisation nummer behövs för att 
    //sätta rätt pris på respektive användare, det är något som sker i backend
    };

    document.getElementById('subscriber-name').textContent = userData.name;
    document.getElementById('subscriber-email').textContent = userData.email;
    document.getElementById('subscriber-phone').textContent = userData.phone;
    document.getElementById('subscriber-state').textContent = userData.state;
    document.getElementById('update-frequency').value = userData.frequency;
});

/*Anropa denna funktion och stoppa in 
data för användaren*/
async function create_subscriber(data){


    let response = await fetch('https://bergstrom.pythonanywhere.com/create_user', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
    });
    let jsonResult = await response.json();
    console.log(jsonResult);
}