




//TA bort felmeddelandet efter 3 sekunder
function remove_error_message(id, delay = 3000){
    setTimeout(function() {
        let error_message = document.getElementById(id);
        error_message.style.visibility = 'hidden';
    }, delay);
}

//Hämtar knappen som finns
const register_button = document.getElementById('register_button');
//Lägger till en eventlistener på knappen
register_button.addEventListener('click', async function() {
    try{
        let email = document.getElementById('email').value;
        let passw = document.getElementById('passw').value;
        let api_key = document.getElementById('api_key').value;
        display_loadingscreen();
        result = await create_customer(email, passw, api_key);
        if (result['Success']){
            remove_loadingscreen();
            let error_message = document.getElementById('error_message');
            error_message.style.backgroundColor = '#99ff5a';
            error_message.innerHTML = result['Message'];
            error_message.style.visibility = 'visible';
            console.log(result);
            window.location.href="https://www.maddec.online/Login_Dagspressutgivarna/";
        }
        else{
            remove_loadingscreen();
            display_error_message(result['Message']);
            console.log('Kund har inte skapats');
            console.log(result);
        }
    }
    catch (error){
        remove_loadingscreen();
        display_error_message('Problem uppstod...');
    }
});

//Denna anropas när något har gått tokigt
function display_error_message(message){
    let error_message = document.getElementById('error_message');
    error_message.style.backgroundColor = '#ff5a5a';
    error_message.innerHTML = message;
    error_message.style.visibility = 'visible';
    console.log(message);
    remove_error_message('error_message');

    if (message == 'E-postadress är ogiltigt.'){
        let email = document.getElementById('email');
        email.style.border = '1px solid #ff5a5a';
    }
    else if (message == 'Lösenordet är ogiltigt.'){
        let passw = document.getElementById('passw');
        passw.style.border = '1px solid #ff5a5a';
    }
    else if (message == 'Kontrollera säkerhetsfrasen.'){
        let api_key = document.getElementById('api_key');
        api_key.style.border = '1px solid #ff5a5a';
    }
}

document.getElementById('email').addEventListener('input', function() {
    let email = document.getElementById('email');
    email.style.border = '';
});
document.getElementById('passw').addEventListener('input', function() {
    let passw = document.getElementById('passw');
    passw.style.border = '';
});

document.getElementById('api_key').addEventListener('input', function() {
    let api_key = document.getElementById('api_key');
    api_key.style.border = '';
});


//Function för att genomföra anrop till en route hos databasen, skapande av kund
async function create_customer(email, passw, api_key) {
    let data = {'email': email, 'passw': passw, 'api_key': api_key};
    let response = await fetch('https://bergstrom.pythonanywhere.com/create_customer_profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let jsonResult = await response.json();
    return jsonResult;
}

  function display_loadingscreen(){
    document.getElementById('loading_screen').style.display = 'flex';
  }
  function remove_loadingscreen(){
    document.getElementById('loading_screen').style.display = 'none';
  }