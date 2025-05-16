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
            displayErrorMessage(jsonResult['Message']);
        }
    } else {
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
                    <div><strong>Email:</strong> ${value['email']}</div>
                </div>
                <button class="no_border_button" title="Radera organisation">
                    <i class="bi bi-trash"></i>
                </button>
            `;

            list_element.querySelector('button').addEventListener('click', () => {
                if (confirm('Är du säker på att du vill radera denna organisation?')) {
                    delete_organisation(value['orgnr']);
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
    let response = await fetch('https://bergstrom.pythonanywhere.com/delete_organisation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(organisation)
    });
    let jsonResult = await response.json();
    if (jsonResult['Success']) {
        location.reload();
    } else {
        displayErrorMessage("Kunde inte radera organisationen.");
    }
}

// Add event listener for form submission
document.getElementById('organisationForm').addEventListener('submit', createOrganisation);

// Add input masking for organization number
document.getElementById('orgnr').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
});