








//TA bort felmeddelandet efter 3 sekunder
function remove_error_message(id, delay = 3000){
    setTimeout(function() {
        let error_message = document.getElementById(id);
        error_message.style.visibility = 'hidden';
    }, delay);
}






//Hämtar knappen som finns
const register_button = document.getElementById('login_button');
//Lägger till en eventlistener på knappen
register_button.addEventListener('click', async function() {
    try{
        let email = document.getElementById('email').value;
        let passw = document.getElementById('passw').value;
        result = await login_customer(email, passw);
        if (result['Success']){
            remove_loadingscreen();
            let error_message = document.getElementById('error_message');
            error_message.style.backgroundColor = '#99ff5a';
            error_message.innerHTML = result['Message'];
            error_message.style.visibility = 'visible';
            console.log(result);
            window.location.href="https://www.maddec.online/Dagspressutgivarna/";
        }
        else{
            remove_loadingscreen();
            display_error_message(result);
        }
    }
    catch (error){
        remove_loadingscreen();
        display_error_message('Problem uppstod...');
    }
});

function display_error_message(result){
    let error_message = document.getElementById('error_message');
    error_message.style.backgroundColor = '#ff5a5a';
    error_message.innerHTML = result['Message'];
    error_message.style.visibility = 'visible';
    console.log(result);
    remove_error_message('error_message');

    let email = document.getElementById('email');
    let passw = document.getElementById('passw');
    email.style.border = '1px solid #ff5a5a';
    passw.style.border = '1px solid #ff5a5a';
    
    
}

//Function för att genomföra anrop till en route hos databasen, skapande av kund
async function login_customer(email, passw) {
    let data = {'email': email, 'passw': passw};
    display_loadingscreen();
    let response = await fetch('https://bergstrom.pythonanywhere.com/check_customer_credentials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
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