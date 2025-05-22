async function createOrganisation(event) {
    event.preventDefault();
    
    if (!validateForm()) return;

    const button = document.querySelector('.submit-button');
    button.disabled = true;
    button.classList.add('loading');

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
        orgnr,
        email,
        passw,
        orgname,
        weekly,
        monthly,
        yearly,
        fontstyle,
        fontsize,
        primarycolor,
        secondarycolor
    };

    try {
        await writeOrganisation(company_profile);
        displaySuccessMessage("Organisation skapad!");
    } catch (err) {
        displayErrorMessage("Ett oväntat fel inträffade.");
        console.error(err);
    } finally {
        button.disabled = false;
        button.classList.remove('loading');
    }
}

function validateForm() {
    const orgnr = document.getElementById('orgnr').value;
    const email = document.getElementById('email').value;
    const passw = document.getElementById('passw').value;

    if (!/^\d{10}$/.test(orgnr)) {
        displayErrorMessage("Organisationsnummer måste vara 10 siffror");
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        displayErrorMessage("Ogiltig e-postadress");
        return false;
    }

    if (passw.length < 6) {
        displayErrorMessage("Lösenordet måste vara minst 6 tecken");
        return false;
    }

    return true;
}

function displayErrorMessage(message) {
    const error_message = document.getElementById('error_message');
    error_message.classList.add('visible');
    error_message.innerText = message;
    setTimeout(() => {
        error_message.classList.remove('visible');
    }, 5000);
}

function displaySuccessMessage(message) {
    const success_message = document.getElementById('success_message');
    success_message.classList.add('visible');
    success_message.innerText = message;
    setTimeout(() => {
        success_message.classList.remove('visible');
    }, 5000);
}

async function writeOrganisation(company_profile) {
    display_loadingscreen();
    let response = await fetch('https://bergstrom.pythonanywhere.com/create_organisation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(company_profile)
    });

    let jsonResult = await response.json();
    if (!jsonResult['Success']) {
        if (jsonResult['Message']) {
            displayErrorMessage('Gick inte att spara undan organisationen\nKontrollera att den inte redan finns.');
            remove_loadingscreen();
        }
    } else {
        remove_loadingscreen();
        location.reload();
    }
}

async function getExistingOrganisations() {
    const company_list = document.getElementById('company_list');
    company_list.innerHTML = '<div class="loading">Laddar organisationer...</div>';

    try {
        let response = await fetch('https://bergstrom.pythonanywhere.com/get_organisations');
        let jsonResult = await response.json();
        company_list.innerHTML = "";

        if (Object.keys(jsonResult).length === 0) {
            company_list.innerHTML = '<div class="empty-state">Inga organisationer hittades</div>';
            return;
        }

        for (let [_, value] of Object.entries(jsonResult)) {
            let list_element = document.createElement('div');
            list_element.classList.add('list_element');

            list_element.innerHTML = `
                <div class="org-details">
                    <div><strong>Org.nr:</strong> ${value['orgnr']}</div>
                    <div><strong>Org.namn:</strong> ${value['orgname']}</div>

                    <div class="email-display">
                        <strong>E-post:</strong> ${value['email']} 
                        <button class="no_border_button change-email-btn" title="Ändra e-postadress">
                            <i class="bi bi-pen"></i>
                        </button>
                    </div>

                    <div class="email-edit" style="display: none;">
                        <input type="email" value="${value['email']}" id="email-id-${value['orgnr']}">
                        <button class="save-email">Spara</button>
                        <button class="cancel-email">Avbryt</button>
                    </div>

                    <div>
                        <strong>Antal utskick:</strong>
                        <span class="number_of_messages">X</span>
                        <button class="no_border_button messages_number" title="Visa antal meddelanden">
                            <i class="bi bi-bar-chart-fill"></i>
                        </button>
                    </div>

                </div>
                <button class="no_border_button email-btn" title="Skicka e-post">
                    <i class="bi bi-envelope"></i>
                </button>
                <button class="no_border_button delete-btn" title="Radera organisation">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            list_element.querySelector('.messages_number').addEventListener('click', async () => {
            //Hämtar data ifrån daniels meddelandemodul baserat på den organisation som finns
                let message_result = await fetch(`https://smsmodule.pythonanywhere.com/get_sms_stats/${value['orgnr']}`);
                let message_data = await message_result.json();
                console.log(message_data);
                if(message_data.status == 'success'){
                    list_element.querySelector('.number_of_messages').innerText = message_data['entries_found'];
                }
            });

            //Utskick av e-postmeddelande
            list_element.querySelector('.email-btn').addEventListener('click', () => {
                if(confirm('Är du säker på att du vill skicka e-post till denna organisation?\nMottagaren kommer att få ett nytt lösenord.')) {
                    send_email(value['orgnr'], value['email']);
                }
            });

            //Radering av företaget
            list_element.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('Är du säker på att du vill radera denna organisation?')) {
                    delete_organisation(value['orgnr']);
                }
            });

            list_element.querySelector('.change-email-btn').addEventListener('click', () => {
                let emailText = list_element.querySelector('.email-display');
                let emailEdit = list_element.querySelector('.email-edit');
                
                //Sätter inputfältet till den aktuella e-postadressen
                //document.getElementById('email-id').value = value['email'];

                emailText.style.display = 'none';
                emailEdit.style.display = 'block';
                
                
                //test_email = 'asd234234@gmail.com'
                //update_organisation(test_email, value['orgnr']);
            });

            list_element.querySelector('.cancel-email').addEventListener('click', () => {
                let emailText = list_element.querySelector('.email-display');
                let emailEdit = list_element.querySelector('.email-edit');
                


                emailText.style.display = 'block';
                emailEdit.style.display = 'none';
                
            });
            
            //Spara ner e-post till databasen
            list_element.querySelector('.save-email').addEventListener('click', async () => {
                //Hämta värdet ifrån input samt orgnr och anropa funktionen
                result = await update_organisation(document.getElementById(`email-id-${value['orgnr']}`).value, value['orgnr']);
                
                if (result['Success']) {
                    let emailText = list_element.querySelector('.email-display');
                    let emailEdit = list_element.querySelector('.email-edit');
                    emailText.style.display = 'block';
                    emailEdit.style.display = 'none';
                    console.log(result);
                    remove_loadingscreen();
                    location.reload();
                } else {
                    displayErrorMessage("Kunde inte uppdata e-post för organisationen.");
                    remove_loadingscreen();
                }
                
            });

            company_list.appendChild(list_element);
        }
    } catch (err) {
        company_list.innerHTML = '<div class="error">Kunde inte ladda organisationer</div>';
        console.error(err);
    }
}

async function delete_organisation(orgnr) {
    let organisation = { orgnr };
    display_loadingscreen();
    let response = await fetch('https://bergstrom.pythonanywhere.com/delete_organisation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(organisation)
    });
    let jsonResult = await response.json();
    if (jsonResult['Success']) {
        remove_loadingscreen();
        location.reload();
    } else {
        displayErrorMessage("Kunde inte radera organisationen.");
        remove_loadingscreen();
    }
}
async function update_organisation(email, orgnr) {
    let data = {'orgnr': orgnr, 'email': email};
    display_loadingscreen();
    let response = await fetch('https://bergstrom.pythonanywhere.com/update_org_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let jsonResult = await response.json();
    return jsonResult;
}

// Add event listener for form submission
document.getElementById('organisationForm').addEventListener('submit', createOrganisation);

// Add input masking for organization number
document.getElementById('orgnr').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
});


async function send_email(orgnr, email){
    //Datan som vi ska skicka iväg
    data = {'orgnr': orgnr, 'email': email};
    console.log(orgnr);
    //Anropet till routen
    display_loadingscreen();
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
        alert('Ett e-postmeddelande har skickats till ' + email + '\nDet kan ta några minuter innan mejlet kommer fram.');
        remove_loadingscreen();
    }
    else{
        //Om det inte gick bra så visar vi ett meddelande
        alert('Det gick inge bra att skicka e-postmeddelande. Testa igen om en liten stund.');
        remove_loadingscreen();
    }
}

async function check_login(){
    
    let response = await fetch('https://bergstrom.pythonanywhere.com/customer_is_logged_in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({})
    });
    const jsonResult = await response.json();
    console.log('Resultatet', jsonResult);
    if (jsonResult['Success']){
        console.log(jsonResult['Message']);
        getExistingOrganisations();
    }
    else{
        console.log(jsonResult['Message']);
        window.location.href = "https://www.maddec.online/Dagspressutgivarna/login.html";
    }
}




function display_loadingscreen(){
    document.getElementById('loading_screen').style.display = 'flex';
  }
function remove_loadingscreen(){
    document.getElementById('loading_screen').style.display = 'none';
  }