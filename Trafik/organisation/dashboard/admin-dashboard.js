

function remove_error_message(id, delay = 3000){
    setTimeout(function() {
        let error_message = document.getElementById(id);
        error_message.style.visibility = 'hidden';
    }, delay);
}


  function applySettings() {
    data = {
      'weekly': document.getElementById('weekly').value,
      'monthly': document.getElementById('monthly').value,
      'yearly': document.getElementById('yearly').value,
      'primarycolor': document.getElementById('primarycolor').value,
      'secondarycolor': document.getElementById('secondarycolor').value,
      'fontstyle': document.getElementById('font-family').value,
      'fontsize': document.getElementById('fontsize').value,
      'city': document.getElementById('city').value
  }
  display_loadingscreen();
    update_organisation(data);
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
          remove_loadingscreen();
          console.log('Organisationen har uppdaterats: ', jsonResult);
          //återanvänder vårt "error meddelanden" och anger annan färg osv
          let error_message = document.getElementById('error_message');
          error_message.style.backgroundColor = '#99ff5a';
          error_message.innerHTML = jsonResult['Message'];
          error_message.style.visibility = 'visible';
          remove_error_message('error_message');
        }
        else{
          remove_loadingscreen();
          console.log('Problem med att uppdatera organisationen: ', jsonResult['Message']);
          display_error_message(jsonResult['Message']);
        }
      } else {
        remove_loadingscreen();
        console.log('Det gick inte att uppdatera orgranisationen...');
      }
    //errorhanterare  
    } catch (error) {
      remove_loadingscreen();
      console.error('Det gick inte att anropa databasen...', error);
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

    if (message == 'Priset är ogiltigt.'){
        let weekly = document.getElementById('weekly');
        let monthly = document.getElementById('monthly');
        let yearly = document.getElementById('yearly');

        /*Här kontrollerar vi respektive fält ifall det är ett nummer och som är 
        om dom är felaktiga så sätter vi en röd kant runt dessa*/
        if (isNaN(parseFloat(weekly.value)) || weekly.value.trim() === '') {
            weekly.style.border = '1px solid #ff5a5a';
        }

        if (isNaN(parseFloat(monthly.value)) || monthly.value.trim() === '') {
            monthly.style.border = '1px solid #ff5a5a';
        }

        if (isNaN(parseFloat(yearly.value)) || yearly.value.trim() === '') {
            yearly.style.border = '1px solid #ff5a5a';
        }
    }
    else if (message == 'Teckenstorlek är ogiltigt.'){
      let fontsize = document.getElementById('fontsize');
        if (isNaN(parseFloat(fontsize.value)) || fontsize.value.trim() === '') {
            fontsize.style.border = '1px solid #ff5a5a';
        }
    }
}


  //Avbryt knapp, anropar log-out functionen
  document.getElementById('cancel-button').addEventListener('click', logout_organisation);
  
  document.getElementById('apply-button').addEventListener('click', applySettings);


  document.getElementById('weekly').addEventListener('input', function() {
      let weekly = document.getElementById('weekly');
      weekly.style.border = '';
  });
  document.getElementById('monthly').addEventListener('input', function() {
      let monthly = document.getElementById('monthly');
      monthly.style.border = '';
  });

  document.getElementById('yearly').addEventListener('input', function() {
      let yearly = document.getElementById('yearly');
      yearly.style.border = '';
  });

  document.getElementById('fontsize').addEventListener('input', function() {
      let fontsize = document.getElementById('fontsize');
      fontsize.style.border = '';
  });
  /*Utloggning för organisationer, en egen route där vi rensar
  sessionsvariabeln hos Flask */
  async function logout_organisation(){
    try{
      display_loadingscreen();
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
        window.location.href = `../login/`;//Dirigera om användaren till login-sidan
        remove_loadingscreen();
      }
      else{
        remove_loadingscreen();
        console.log('Problem med att logga ut organisationen.');
      }
    }
    catch (error){
      remove_loadingscreen();
      console.log('Problem med att anropa databasen...', error);
    }
  }


  function display_loadingscreen(){
    document.getElementById('loading_screen').style.display = 'flex';
  }
  function remove_loadingscreen(){
    document.getElementById('loading_screen').style.display = 'none';
  }