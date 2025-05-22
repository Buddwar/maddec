









//Hämtar knappen som finns
const register_button = document.getElementById('register_button');
//Lägger till en eventlistener på knappen
register_button.addEventListener('click', async function() {
    let email = document.getElementById('email').value;
    let passw = document.getElementById('password').value;
    let api_key = document.getElementById('api_key').value;
    display_loadingscreen();
    result = await create_customer(email, passw, api_key);
    if (result['Success']){
        remove_loadingscreen();
        console.log('Kund har skapats');
        console.log(result);
    }
    else{
        remove_loadingscreen();
        console.log('Kund har inte skapats');
        console.log(result);
    }
});




//Function för att genomföra anrop till en route hos databasen, skapande av kund
async function create_customer(email, passw, api_key) {
    let data = {'email': email, 'passw': passw, 'api_key': api_key};
    display_loadingscreen();
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