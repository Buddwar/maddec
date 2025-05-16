document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // validate credentials against backend
    //console.log('Login attempt:', { username, password });
    
    


    result = await login (username, password);
    console.log('Resultatet av inlogg:', result)
    if(result['Success']){
        //Redirect to subscription page after successful login
            let orgnr = getUrl();
            let subscription_url = `subscription.html?orgnr=${orgnr}`;
            window.location.href = subscription_url;
    }
});

document.getElementById('back_button').addEventListener('click', (e) => {
    e.preventDefault();
    let orgnr = getUrl();
    let index_url = `index.html?orgnr=${orgnr}`;
    window.location.href = index_url;
});

async function login(email, passw){
    user_credentials = {'email': email, 'passw': passw}

    //Vi gör vårt anrop till routen
    
    let response = await fetch('https://bergstrom.pythonanywhere.com/checkcredentials_user', {
        method: 'POST',//Metoden är POST eftersom vi vill skicka data dit
        headers: {
            //Datan som skickas behöver vara som json
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        //O vi stoppar in vår dictionary beståendes av orgnr och lösenord
        body: JSON.stringify(user_credentials)
    });

    /*Resultatet som man får tillbaka är 
{Success: True/False, Message: 'meddelande'}*/
    const jsonResult = await response.json();
    console.log('Resultatet', jsonResult);
    return jsonResult;
}

  /*Här hämtar vi ut orgnr ifrån URL */
function getUrl(){
    let url_org = new URLSearchParams(window.location.search);
    return url_org.get('orgnr');
  }

