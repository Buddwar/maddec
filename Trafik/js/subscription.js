let countrycodes = {
  "01": "Stockholms län",
  "03": "Uppsala län",
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
  "18": "Örebro län",
  "19": "Västmanlands län",
  "20": "Dalarnas län",
  "21": "Gävleborgs län",
  "22": "Västernorrlands län",
  "23": "Jämtlands län",
  "24": "Västerbottens län",
  "25": "Norrbottens län"
};
  
  
  // Function to show success message
  function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Save button click handler
document.getElementById('save-button').addEventListener('click', async () => {
    const countrycode = document.getElementById('update-frequency').value;
    /*Jag ändrade så att man kan uppdatera vilket län man prenumerar på */
    display_loadingscreen();
    let result = await update_user_details(countrycode);//Functionen kommer returnera en dict tillbaka
    //Dicten kommer se ut likt följande > {'Success': 'True/False', 'Message': 'meddelande'}
    if(result['Success']){
        remove_loadingscreen();
        // Show success message
        showSuccessMessage();
        //Laddar om nuvarande fönstret så att uppdaterade uppgifter om användaren visas
        window.location.reload();
        console.log(result['Message']);
    }
});

// Cancel button click handler
document.getElementById('cancel-button').addEventListener('click', async() => {

    //Anropa databasen och logga ut användaren
    display_loadingscreen();
    let result = await logout_user();
    if(result['Success']){//Om det gick bra med att logga ut
        let orgnr = getUrl();
        let index_url = `index.html?orgnr=${orgnr}`;
        remove_loadingscreen();
        window.location.href = index_url;

        //window.location.href = 'index.html';//Dirigera om användaren
    }
    else{
        console.log('Problem uppstod med att logga ut användaren...');
    }
});
document.getElementById('delete-button').addEventListener('click', async() => {
try{
    let dialog_window = 'Är du säker på att du vill radera ditt konto?';

    if (confirm(dialog_window)){
        //Hämta email ifrån sidan
        let email = document.getElementById('subscriber-email').textContent.trim();
        console.log(email);
        //Anropa databasen och radera användaren
        display_loadingscreen();
        let result = await delete_user(email);
        if(result['Success']){//Om allting gick bra med raderingen
            remove_loadingscreen();
            console.log(result['Message']);
            //Då loggar vi ut användaren
            let logout_result = await logout_user();
            if (logout_result['Success']){
                console.log('Användarens konto är raderat och personen blev utloggad');
                window.location.reload();
            }
        }
        else{
            console.log('Problem med att radera användaren...', result['Message']);
            window.location.reload();
        }
    }
    else{
        console.log('Användaren tröck avbryt');
        window.location.reload();
    }
}
catch (error){
    console.log('Ett problem uppstod');
    remove_loadingscreen();
}

});
//Användaren klickar på förläng-knappen
document.getElementById('extend-button').addEventListener('click', async() => {
    //Vi hämtar ut e-postadressen
    let email = document.getElementById('subscriber-email').textContent.trim();
    //Vi visar vår loading screen då det kanske tar lite tid att göra ett anrop
    display_loadingscreen();
    let result = await extend_subscription(email);
    if(result['Success']){//Om det gick bra
        remove_loadingscreen();//Då tar vi bort loading screen
        console.log(result['Message']);
        window.location.reload();//Och laddar om nuvarande sida
    }
    else{
        remove_loadingscreen();
        console.log('Gick inte att hämta data');
    }
});

async function extend_subscription(email){
    let response = await fetch('https://bergstrom.pythonanywhere.com/extend_subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({email})
    });
    let jsonResult = await response.json();
    return jsonResult;
}

function setColors(result){
    let saveBtn = document.getElementById('save-button');
    let extendBtn = document.getElementById('extend-button');
    let deleteBtn = document.getElementById('delete-button');  
    let logoutBtn = document.getElementById('cancel-button'); 

    //Sparningsknappen
    saveBtn.style.backgroundColor = result['Data']['primarycolor'];
    saveBtn.style.color = result['Data']['secondarycolor'];

    //Förlängningsknappen
    extendBtn.style.backgroundColor = '#f0f0f0';
    extendBtn.style.color = result['Data']['primarycolor'];
    extendBtn.style.border = '1px solid ' + result['Data']['primarycolor'];

    //Raderaknappen
    deleteBtn.style.backgroundColor = '#f0f0f0';
    deleteBtn.style.color = result['Data']['primarycolor'];

    //Logga ut knappen
    logoutBtn.style.backgroundColor = '#f0f0f0';
    logoutBtn.style.color = result['Data']['primarycolor'];
    logoutBtn.style.border = '1px solid ' + result['Data']['primarycolor'];

    //Titeln på sidan
    document.getElementById('prenumeration_title').style.color = result['Data']['primarycolor'];

    let strongElements = document.querySelectorAll('.subscription-info strong');
    strongElements.forEach((element) => {
        element.style.color = result['Data']['primarycolor'];
    });

    //Sätter hela sidans teckensnitt
    document.body.style.fontFamily = result['Data']['fontstyle'];

    //Sätter fontsize på diverse knappar och text
    let px = parseFloat(result['Data']['fontsize']);
    let rem = px / 10;
    document.body.style.fontSize = rem + 'rem';
    document.getElementById('prenumeration_title').style.fontSize = 1.5 + 'rem';
}

//Ladda in befintliga uppgifter om användaren
window.addEventListener('load', async () => {
    //Hämta organisation och ladda in de färger som finns
    let orgnr = getUrl();
    result = await load_organisation(orgnr);
    if(result['Success']){
        console.log(result['Data']);
        //Sätt färgerna baserat på organisationens data
        setColors(result);
    }
    else{
        console.log(jsonResult['Message']);
    }

    //Hämta användarens data
    display_loadingscreen();
    let subscriber_data = await get_user_details();
    if(subscriber_data['Success']){//Om vi lyckades hämta data, t. ex. om användaren är inloggad så ska det fungera
        remove_loadingscreen();
        document.getElementById('subscriber-name').textContent = subscriber_data['Data']['fname'] + ' ' + subscriber_data['Data']['lname'];
        document.getElementById('subscriber-email').textContent = subscriber_data['Data']['email'];
        document.getElementById('subscriber-phone').textContent = subscriber_data['Data']['phone'];
        document.getElementById('subscriber-state').textContent = countrycodes[subscriber_data['Data']['countrycode']];
        //document.getElementById('update-frequency').value = subscriber_data['Data']['subtype'];  
    }
    else{//Något gick tokigt med hämtningen av data, t. ex. användaren är inte inloggad?
        remove_loadingscreen();
        console.log(subscriber_data)
        let orgnr = getUrl();
        let index_url = `index.html?orgnr=${orgnr}`;
        window.location.href = index_url;
    }
});
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

/*Vi hämtar organisationen som användaren är inloggad hos för att 
sätta olika färger osv, hämta data*/
async function load_organisation(orgnr){
let data = {'orgnr': orgnr};
    let response = await fetch('https://bergstrom.pythonanywhere.com/get_organisation', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
    });
    let jsonResult = await response.json();
    return jsonResult;
}

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

/*Function för att uppdatera användaren som är inloggad
Endast countrycode behövs vid anrop av funktionen */
async function update_user_details(countrycode){
    let data = {'countrycode': countrycode}
    let response = await fetch('https://bergstrom.pythonanywhere.com/update_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    let jsonResult = await response.json();
    return jsonResult;
}

  /*Function för att logga ut användaren */
  async function logout_user(){

    let response = await fetch('https://bergstrom.pythonanywhere.com/logout_user', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include'
  });
    let jsonResult = await response.json();
    return jsonResult;
  }
/*Här hämtar vi ut orgnr ifrån URL */
function getUrl(){
    let url_org = new URLSearchParams(window.location.search);
    return url_org.get('orgnr');
}


  /*Function för att radera användaren*/
  async function delete_user(email){
    let response = await fetch('https://bergstrom.pythonanywhere.com/delete_user', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({email: email})
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
