

function remove_error_message(id, delay = 3000){
    setTimeout(function() {
        let error_message = document.getElementById(id);
        error_message.style.visibility = 'hidden';
    }, delay);
}


  function applySettings() {
    console.log('Applying settings to backend…', currentSettings);

    data = {
      'weekly': document.getElementById('weekly').value,
      'monthly': document.getElementById('monthly').value,
      'yearly': document.getElementById('yearly').value,
      'primarycolor': document.getElementById('primarycolor').value,
      'secondarycolor': document.getElementById('secondarycolor').value,
      'fontstyle': document.getElementById('font-family').value,
      'fontsize': document.getElementById('fontsize').value
  }
    update_organisation(data);
    showSuccessMessage();
  }
  
  window.addEventListener('load', () => {
    //Exempelvis ladda organisationen ifråga när sidan laddas och sätt alla färger
    load_organisation();
  });
  

  async function load_organisation(){

    /*Här vill vi hämta den organisation som ska visas
    baserat på om företaget har lyckats logga in
    
    denna route använder sig av organisationsnumret och det är något som sparades
    undan när organisationen genomförde en lyckad inloggning
    
    med andra ord, vi behöver inte skicka in ett organisationsnummer till databasen.
    Databasen har koll på vem det är som är inloggad baserat på sessionen/cookies*/
        let response = await fetch('https://bergstrom.pythonanywhere.com/get_single_organisation', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },//Här skickar med vår sessionscookie från serversidan
          //o det är ju då för att kontrollera VEM det är som är inloggad
          credentials: 'include',
          body: JSON.stringify({})
      });
      let jsonResult = await response.json();
      console.log('Det här är organisationen som finns', jsonResult);
      if(jsonResult['Success']){
        document.getElementById('weekly').value = jsonResult['Data']['weekly'];
        document.getElementById('monthly').value = jsonResult['Data']['monthly'];
        document.getElementById('yearly').value = jsonResult['Data']['yearly'];
        document.getElementById('primarycolor').value = jsonResult['Data']['primarycolor'];
        document.getElementById('secondarycolor').value = jsonResult['Data']['secondarycolor'];
        document.getElementById('font-family').value = jsonResult['Data']['fontstyle'];
        document.getElementById('fontsize').value = jsonResult['Data']['fontsize'];
        document.getElementById('company_name').innerHTML = jsonResult['Data']['orgname'];
      }
      else{
        //Dirigera om användaren till login-sidan
        console.log('Problem med att hämta organisationen');
        logout_organisation();
      }

    }

  //Anropa funktionen och skicka in den data som behövs(dict)
  async function update_organisation(data){
    try {
      let response = await fetch('https://bergstrom.pythonanywhere.com/update_organisation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok){
        let jsonResult = await response.json();
        if (jsonResult['Success']){
          console.log('Organisationen har uppdaterats: ', jsonResult);
        }
        else{
          showErrorModal('Problem med att uppdatera organisationen: ' + (jsonResult['Message'] || 'Okänt fel.'));
          console.log('Problem med att uppdatera organisationen: ', jsonResult['Message']);
        }
      } else {
        console.log('Det gick inte att uppdatera orgranisationen...');
      }
    //errorhanterare  
    } catch (error) {
      console.error('Nätverksfel/CORS:', error);
    }
  }

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
    else if (message == 'Kontrollera API-nyckeln.'){
        let api_key = document.getElementById('api_key');
        api_key.style.border = '1px solid #ff5a5a';
    }
}


  //Avbryt knapp, anropar log-out functionen
  document.getElementById('cancel-button').addEventListener('click', logout_organisation);
  

  /*Utloggning för organisationer, en egen route där vi rensar
  sessionsvariabeln hos Flask */
  async function logout_organisation(){

    let response = await fetch('https://bergstrom.pythonanywhere.com/logout_organisation', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include'
  });
    let jsonResult = await response.json();
    console.log(jsonResult);
    if (jsonResult['Success']){//Kontroll att vi lyckades logga ut
      window.location.href = `admin-login.html`;//Dirigera om användaren till login-sidan
    }
  }


  function display_loadingscreen(){
    document.getElementById('loading_screen').style.display = 'flex';
  }
  function remove_loadingscreen(){
    document.getElementById('loading_screen').style.display = 'none';
  }