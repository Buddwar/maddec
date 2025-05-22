
















//Hämtar knappen som finns
const register_button = document.getElementById('login_button');
//Lägger till en eventlistener på knappen
register_button.addEventListener('click', async function() {
    let email = document.getElementById('email').value;
    let passw = document.getElementById('passw').value;
    result = await login_customer(email, passw);
    if (result['Success']){
        remove_loadingscreen();
        console.log(result);
        window.location.href="https://www.maddec.online/Dagspressutgivarna/";
    }
    else{
        remove_loadingscreen();
        console.log(result);
    }
});




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