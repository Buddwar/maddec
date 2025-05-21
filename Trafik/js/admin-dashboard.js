/* Current settings */
let currentSettings = {
    state: '01',
    fontFamily: 'Arial, sans-serif',
    bgColor: '#ffffff',
    textColor: '#333333',
    buttonColor: '#007bff',
    buttonTextColor: '#ffffff',
  };
  
  /**
   * Show a temporary success message
   */
  function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    if (!successMessage) return;
    successMessage.style.display = 'block';
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 3000);
  }
  
  /**
   * Update the displayed hex code next to a color input
   */
  function updateColorName(inputId, nameId) {
    const input = document.getElementById(inputId);
    const name  = document.getElementById(nameId);
    if (!input || !name) return;
    input.addEventListener('input', () => {
      name.textContent = input.value.toUpperCase();
    });
  }
  
  /**
   * Setup preset-color swatches to update a linked input + preview
   */
  function setupPresetColors(presetContainerId, colorInputId) {
    const container = document.getElementById(presetContainerId);
    const input     = document.getElementById(colorInputId);
    if (!container || !input) return;
  
    container.querySelectorAll('.preset-color').forEach(preset => {
      preset.addEventListener('click', () => {
        // toggle selected borders
        container.querySelectorAll('.preset-color').forEach(p => p.classList.remove('selected'));
        preset.classList.add('selected');
  
        // write into the <input type="color"> and its label
        const color = preset.dataset.color;
        input.value = color;
        const nameSpan = document.getElementById(`${colorInputId}-name`);
        if (nameSpan) nameSpan.textContent = color.toUpperCase();
  
        updatePreview();
      });
    });
  }
  
  /**
   * Read all form controls, store them, and reload the iframe
   */
  function updatePreview() {
    const iframe     = document.getElementById('preview-iframe');
    const state      = document.getElementById('state-selector')?.value;
    const fontFamily = document.getElementById('font-family')?.value;
    const bgColor    = document.getElementById('bg-color')?.value;
    const textColor  = document.getElementById('text-color')?.value;
    const buttonColor      = document.getElementById('button-color')?.value;
    const buttonTextColor  = document.getElementById('button-text-color')?.value;
  
    // Update our settings object
    currentSettings = {
      state,
      fontFamily,
      bgColor,
      textColor,
      buttonColor,
      buttonTextColor,
    };
  
    console.log('Preview settings:', currentSettings);
  
    // Rebuild iframe URL with query-string params (slice off the leading "#")
    if (iframe) {
      const qs = [
        `state=${state}`,
        `font=${encodeURIComponent(fontFamily)}`,
        `bg=${bgColor.slice(1)}`,
        `text=${textColor.slice(1)}`,
        `button=${buttonColor.slice(1)}`,
        `buttontext=${buttonTextColor.slice(1)}`
      ].join('&');
      iframe.src = `index.html?${qs}`;
    }
  }
  
  /**
   * “Apply” button just shows the green flash and logs the settings
   */
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
  
  // === Initialize color-name labels ===
  updateColorName('bg-color',         'bg-color-name');
  updateColorName('text-color',       'text-color-name');
  updateColorName('button-color',     'button-color-name');
  updateColorName('button-text-color','button-text-color-name');
  
  // === Hook up the preset-swatches ===
  setupPresetColors('bg-presets',         'bg-color');
  setupPresetColors('text-presets',       'text-color');
  setupPresetColors('button-presets',     'button-color');
  setupPresetColors('button-text-presets','button-text-color');
  
  // === Live-preview listeners ===
  [
    { id: 'state-selector',    type: 'change' },
    { id: 'font-family',       type: 'change' },
    { id: 'bg-color',          type: 'input'  },
    { id: 'text-color',        type: 'input'  },
    { id: 'button-color',      type: 'input'  },
    { id: 'button-text-color', type: 'input'  }
  ].forEach(({id, type}) => {
    document.getElementById(id)?.addEventListener(type, updatePreview);
  });
  
  // === Apply button & initial load ===
  document.getElementById('apply-button')?.addEventListener('click', applySettings);
  //window.addEventListener('load', updatePreview);

  window.addEventListener('load', () => {
    updatePreview();
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
        showErrorModal('Kunde inte uppdatera organisationen. Serverfel eller nätverksproblem.');
      }
    //errorhanterare  
    } catch (error) {
      showErrorModal('Nätverksfel eller CORS-problem. Vänligen försök igen senare.');
      console.error('Nätverksfel/CORS:', error);
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

  window.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('errorModal');
    const closeBtn = document.getElementById('closeErrorModal');
    if (closeBtn && modal) {
      closeBtn.onclick = function() {
        modal.style.display = 'none';
        modal.classList.remove('show');
      };
    }
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
      }
    };
  });

  function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const modalContent = document.getElementById('errorMessage');
    if (modal && modalContent) {
      modalContent.textContent = message;
      modal.style.display = 'block';
      modal.classList.add('show');
    } else {
      alert(message);
    }
  }