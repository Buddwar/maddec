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

document.getElementById('back-button').addEventListener('click', (e) => {
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


window.addEventListener('load', () => {
  //let iframeWidth = window.innerWidth;
  //Vi hämtar höjden på iframen
  let iframeHeight = window.innerHeight;

  let headline = document.getElementById('title');
  let loginBtn = document.getElementById('login-button');
  let container = document.getElementById('login-container');

  console.log(iframeHeight);
  //Om höjden är mindre än 400px (vilket är minimumhöjden för modalen)
  if (iframeHeight < 400){
    headline.style.display = 'none';
    container.style.padding = '0.5rem';
  }
});






  /*Här hämtar vi ut orgnr ifrån URL */
function getUrl(){
    let url_org = new URLSearchParams(window.location.search);
    return url_org.get('orgnr');
  }

document.addEventListener('DOMContentLoaded', async () => {
  //Hämta orgnr ifrån URL
  let url_org = new URLSearchParams(window.location.search);
  let orgnr = url_org.get('orgnr');
  //Stoppa in orgnr i denna funktion när vi anropar
  let result = await load_organisation(orgnr);
  //Använd resultatet som vi får tillbaka
  document.getElementById('back-button').style.border = '1px solid' + result['Data']['primarycolor'];
  document.getElementById('back-button').style.color = result['Data']['primarycolor'];  
  document.getElementById('back-button').style.backgroundColor = '#FFFFFF'; 


  document.getElementById('login-button').style.backgroundColor = result['Data']['primarycolor'];
  document.getElementById('login-button').style.color = result['Data']['secondarycolor'];
  document.body.style.fontFamily = result['Data']['fontstyle'];
  document.body.style.fontSize = result['Data']['fontsize'] + 'px';
  
  document.getElementById('title').style.color = result['Data']['primarycolor'];
});


async function load_organisation(orgnr){
let data = {'orgnr': orgnr};
display_loadingscreen();
    let response = await fetch('https://bergstrom.pythonanywhere.com/get_organisation', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
    });
    let jsonResult = await response.json();
    if(jsonResult['Success']){
        remove_loadingscreen();
        return jsonResult;
    }
    else{
        remove_loadingscreen();
        alert('Det gick inte att hämta organisationen.');
        console.log(jsonResult['Message']);
    }
}

  function display_loadingscreen(){
    document.getElementById('loading_screen').style.display = 'flex';
  }
  function remove_loadingscreen(){
    document.getElementById('loading_screen').style.display = 'none';
  }