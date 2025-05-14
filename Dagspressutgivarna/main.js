function createOrganisation(){
    /*Vi bygger ihop företagsprofilen */

    let orgnr = document.getElementById('orgnr').value;
    let email = document.getElementById('email').value;
    let passw = document.getElementById('passw').value;
    let orgname = document.getElementById('orgname').value;
    let weekly = document.getElementById('weekly').value;
    let monthly = document.getElementById('monthly').value;
    let yearly = document.getElementById('yearly').value;
    let fontstyle = document.getElementById('fontstyle').value;
    let fontsize = document.getElementById('fontsize').value;
    let primarycolor = document.getElementById('primarycolor').value;
    let secondarycolor = document.getElementById('secondarycolor').value;



    let company_profile = {
        'orgnr': orgnr,
        'email': email,
        'passw': passw,
        'orgname': orgname,
        'weekly': weekly,
        'monthly': monthly,
        'yearly': yearly,
        'fontstyle': fontstyle,
        'fontsize': fontsize,
        'primarycolor': primarycolor,
        'secondarycolor': secondarycolor
    }
    //console.log(company_profile);
    //Kontrollera längden på orgnr
    //Anropar funktionen så att vi kan spara undan den till databasen
    writeOrganisation(company_profile);

}

//Hantering av felmeddelande som visas för användare
function displayErrorMessage(message){
    //let error_message = document.getElementById('error_message');
    //error_message.style.visibility = 'visible';
    //error_message.innerText = message;
    alert(message);
}





/*Vi skriver ner organisationen till databasen
 via denna funktion */
async function writeOrganisation(company_profile){
    //Vi gör ett anrop till vår databas, dess route
    let response = await fetch ('https://bergstrom.pythonanywhere.com/create_organisation', {
        method: 'POST',//Vi ska då skicka data dit, därav POST
        headers: {//specifierar formatet på den data som vi ska skicka
            'Content-Type': 'application/json'
        },//Det som vi skickar är då företagsprofilen som vi konverterar till jsondata
        body: JSON.stringify(company_profile)
    });

    let jsonResult = await response.json();
    console.log(jsonResult);
    if(!jsonResult['Success']){
        //Problem uppstod hos databasen
        if (jsonResult['Message']){
            displayErrorMessage(jsonResult['Message']);
        }
    }
    else{
        //Allting var lyckat och vi laddar om sidan för att uppdatera listan med orgs
        location.reload();
    }
}

/*När sidan laddas så hämtar vi alla sparade organisationer och 
fyller ut listan */
async function getExistingOrganisations(){
    let response = await fetch('https://bergstrom.pythonanywhere.com/get_organisations');
    let jsonResult = await response.json();
    //console.log(jsonResult);

    let company_list = document.getElementById('company_list');

    //Vi loopar igenom respektive nyckel och dess värde
    for (let [key, value] of Object.entries(jsonResult)){
        //console.log(key, value);
        //Vi vill då skapa upp ett list element för varje företag samt andra element
        let list_element = document.createElement('li');
        let orgnr_para = document.createElement('p');
        let orgname_para = document.createElement('p');
        let orgemail_para = document.createElement('p');

        orgnr_para.innerHTML = value['orgnr'];
        orgname_para.innerHTML = value['orgname'];
        orgemail_para.innerHTML = value['email'];
        //Texten som ska visas sätter vi här
        //list_element.innerText = value['orgnr'] + '\n' + value['orgname'] + '\n' + value['email'] + '\n';
        list_element.classList.add('list-group-item');//Slänger in en bootstrap klass så de blir snyggare
        list_element.classList.add('list_element');
        remove_button = document.createElement('button');
        sendmail_button = document.createElement('button');
        //Lägger till en bootstrap icon på knappen
        remove_button.innerHTML = '<i class="bi bi-trash h5"></i>';
        sendmail_button.innerHTML = '<i class="bi bi-envelope-fill"></i>';
        //Appenda paragrafen till varje list element
        list_element.appendChild(sendmail_button);
        list_element.appendChild(orgnr_para);
        list_element.appendChild(orgname_para);
        list_element.appendChild(orgemail_para);
        //Varje list-element får sin egna knapp för radering
        list_element.appendChild(remove_button);
        /*Tar bort borders med hjälp av en klass
        bara så den ska smälta in i bakgrunden*/
        remove_button.classList.add('no_border_button');
        sendmail_button.classList.add('no_border_button');
        


        /*Och sedan så får varje knapp en eventlistener 
        som anropar en funktion för att radera elementet organisationen
        i fråga*/
        remove_button.addEventListener('click', function(){
            //Varje 
            delete_organisation(value['orgnr']);
        });
        sendmail_button.addEventListener('click', function(){
            //Skicka iväg ett mail till företaget
            send_email(value['orgnr'], value['email']);
        });



        //Och det appendas till UL elementet som finns i DOM
        company_list.appendChild(list_element);

}
}

async function send_email(orgnr, email){
    //Datan som vi ska skicka iväg
    data = {'orgnr': orgnr, 'email': email};
    console.log(orgnr);
    //Anropet till routen
    let response = await fetch ('https://bergstrom.pythonanywhere.com/resend_email',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let jsonResult = await response.json();
    console.log(jsonResult);
    if(jsonResult['Success']){
        //Om det gick bra så visar vi ett meddelande
        document.getElementById('alert_message').classList.add('show');
    }
}

/*Borttagning av företag*/
async function delete_organisation(orgnr){
    //Datan som vi ska skicka iväg
    organisation = {'orgnr': orgnr};
    console.log(orgnr);
    //Anropet till routen
    let response = await fetch ('https://bergstrom.pythonanywhere.com/delete_organisation',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(organisation)
    });
    let jsonResult = await response.json();
    console.log(jsonResult);
    location.reload();
}