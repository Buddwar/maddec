let countrycodes = {
"01": "Stockholms Län",
"03": "Uppsalas län",
"04": "Södermanlands län",
"05": "Östergötlands län",
"06": "Jönköpings län",
"07": "Kronobergs län",
"08": "Kalmar län",
"09": "Gotlands län",
"10": "Blekinge län",
"12": "Skåne län",
"13": "Hallands län",
"14": "Västra Götalands län",
"17": "Värmlands län",
"182": "Örebro län",
"19": "Västmanlands län",
"20": "Dalarnas län",
"21": "Gävleborgs län",
"22": "Västernorrlands län",
"23": "Jämtlands län",
"24": "Västerbottens län",
"25": "Norrbottens län"
}
  
  
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
window.addEventListener('load', async () => {
    // This is where we would fetch the user's current subscription data
    // For demo purposes, we're using hardcoded values

    //Hämta användarens data
    let subscriber_data = await get_user_details();
    console.log(subscriber_data);

    /*const userData = {
        name: 'Test Name',
        email: 'test@example.com',
        phone: '070-123 45 67',
        state: 'Stockholms län',
        frequency: 'daily'
    };*/

    document.getElementById('subscriber-name').textContent = subscriber_data['fname'] + ' ' + subscriber_data['lname'];
    document.getElementById('subscriber-email').textContent = subscriber_data['email'];
    document.getElementById('subscriber-phone').textContent = subscriber_data['phone'];
    document.getElementById('subscriber-state').textContent = countrycodes[subscriber_data['countrycode']];
    document.getElementById('update-frequency').value = subscriber_data['subtype'];
});

/*Function för att hämta användaren som är inloggad
Ingen data behöver skickas in här utan det räcker att bara anropa funktionen */
async function get_user_details(){
    let response = await fetch('https://bergstrom.pythonanywhere.com/get_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },//Här skickar med vår sessionscookie från serversidan
        //o det är ju då för att kontrollera VEM det är som är inloggad
        credentials: 'include',
        body: JSON.stringify({})
    });
    let jsonResult = await response.json();
    return jsonResult;
}