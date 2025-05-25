
function remove_error_message(id, delay = 3000){
    setTimeout(function() {
        let error_message = document.getElementById(id);
        error_message.style.visibility = 'hidden';
    }, delay);
}





document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const orgnr = document.getElementById('orgnr').value;
    const password = document.getElementById('passw').value;
    
    try{
        display_loadingscreen();
        let result = await login(orgnr, password);

        if (result['Success']){
            // Redirect to admin dashboard after successful login
            remove_loadingscreen();
            window.location.href = `../dashboard`;
        }
        else{
            display_error_message(result['Message']);
            remove_loadingscreen();
            console.log(result['Message']);
        }
    }
    catch (error){
        remove_loadingscreen();
        console.log(error);
    }

});

function display_error_message(message){
    let error_message = document.getElementById('error_message');
    error_message.style.backgroundColor = '#ff5a5a';
    error_message.innerHTML = message;
    error_message.style.visibility = 'visible';
    remove_error_message('error_message');

    if (message == 'Organisationsnummer är ogiltigt.'){
        let orgnr = document.getElementById('orgnr');
        orgnr.style.border = '1px solid #ff5a5a';
    }
    else if (message == 'Lösenordet är ogiltigt.'){
        let passw = document.getElementById('passw');
        passw.style.border = '1px solid #ff5a5a';
    }
}

//Rensa fälten för att undvika att den här röda kanten fortfarande visas
//så fort användaren börjar skriva
document.getElementById('orgnr').addEventListener('input', function() {
    let orgnr = document.getElementById('orgnr');
    orgnr.style.border = '';
});
document.getElementById('passw').addEventListener('input', function() {
    let passw = document.getElementById('passw');
    passw.style.border = '';
});



/*Anropa denna funktion och stoppa in 10 siffrigt org nr
Lösenordet behöver endast var 8 karaktärer långt för tillfället 
Exempel: orgnr 5512345679, passw hunter23
*/
async function login(orgnr, passw){
    org_credentials = {'orgnr': orgnr, 'passw': passw}

    //Vi gör vårt anrop till routen
    let response = await fetch('https://bergstrom.pythonanywhere.com/checkcredentials_organisation', {
        method: 'POST',//Metoden är POST eftersom vi vill skicka data dit
        headers: {
            //Datan som skickas behöver vara som json
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        //O vi stoppar in vår dictionary beståendes av orgnr och lösenord
        body: JSON.stringify(org_credentials)
    });

    /*Resultatet som man får tillbaka är 
{Success: True/False, Message: 'meddelande'}*/
    const jsonResult = await response.json();
    return jsonResult;
}

  function display_loadingscreen(){
    document.getElementById('loading_screen').style.display = 'flex';
  }
  function remove_loadingscreen(){
    document.getElementById('loading_screen').style.display = 'none';
  }