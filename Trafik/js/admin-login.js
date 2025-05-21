document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // validate credentials against backend
    console.log('Admin login attempt:', { username, password });
    display_loadingscreen();
    let result = await login(username, password);

    if (result['Success']){
        // Redirect to admin dashboard after successful login
        remove_loadingscreen();
        window.location.href = `admin-dashboard.html`;
    }
    else{
        remove_loadingscreen();
        console.log(result['Message']);
    }

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