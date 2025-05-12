import { map } from './map-init.js';
import { getSituations } from './situations.js';
import { getCameras } from './cameras.js';
import { getRoadConditions } from './road-conditions.js';
import { counties } from './counties.js';
import './county-selector.js'; // This automatically adds the dropdown to the map
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

// Jag har testat att kommentera ut kartan här i index.js. Känns onödigt att ha en karta initialiserad här,
// när den redan finns i de andra filerna jag skapade.

// Trafikverket API endpoints
//const TRAFIKVERKET_API = {
  //situation: 'https://trafikverket.onrender.com/traffic/group3/situation',
  //cameras: 'https://trafikverket.onrender.com/traffic/group3/cameras',
  //roadcondition: 'https://trafikverket.onrender.com/traffic/group3/roadcondition'
//};


// Län koordinater
//const COUNTY_COORDINATES = {
  //'01': { lat: 59.3293, lng: 18.0686, zoom: 12 }, // Stockholm
  //'03': { lat: 59.8585, lng: 17.6389, zoom: 12 }, // Uppsala
  //'04': { lat: 59.2239, lng: 17.2719, zoom: 12 }, // Södermanland
  //'05': { lat: 58.4108, lng: 15.6214, zoom: 12 }, // Östergötland
  //'06': { lat: 57.7826, lng: 14.1618, zoom: 12 }, // Jönköping
  //'07': { lat: 56.8772, lng: 14.8054, zoom: 12 }, // Kronoberg
  //'08': { lat: 56.6637, lng: 16.3566, zoom: 12 }, // Kalmar
  //'09': { lat: 57.6291, lng: 18.3077, zoom: 12 }, // Gotland
  //'10': { lat: 56.2786, lng: 15.1172, zoom: 12 }, // Blekinge
  //'12': { lat: 55.9903, lng: 13.5958, zoom: 12 }, // Skåne
  //'13': { lat: 56.8969, lng: 12.8034, zoom: 12 }, // Halland
  //'14': { lat: 57.7089, lng: 12.0116, zoom: 12 }, // Västra Götaland
  //'17': { lat: 59.3261, lng: 13.5169, zoom: 12 }, // Värmland
  //'18': { lat: 59.2741, lng: 15.2066, zoom: 12 }, // Örebro
  //'19': { lat: 59.6099, lng: 16.5448, zoom: 12 }, // Västmanland
  //'20': { lat: 60.6747, lng: 15.7875, zoom: 12 }, // Dalarna
  //'21': { lat: 60.6747, lng: 17.1418, zoom: 12 }, // Gävleborg
  //'22': { lat: 62.3908, lng: 17.3069, zoom: 12 }, // Västernorrland
  //'23': { lat: 63.1718, lng: 14.6359, zoom: 12 }, // Jämtland
  //'24': { lat: 64.7509, lng: 20.9502, zoom: 12 }, // Västerbotten
  //'25': { lat: 67.8558, lng: 20.2253, zoom: 12 }  // Norrbotten
//};

//let trafficMarkers = [];
let trafficSwiper;

// Add state names mapping
//const STATE_NAMES = {
  //'01': 'Stockholms län',
  //'03': 'Uppsala län',
  //'04': 'Södermanlands län',
  //'05': 'Östergötlands län',
  //'06': 'Jönköpings län',
  //'07': 'Kronobergs län',
  //'08': 'Kalmar län',
  //'09': 'Gotlands län',
  //'10': 'Blekinge län',
  //'12': 'Skåne län',
  //'13': 'Hallands län',
  //'14': 'Västra Götalands län',
  //'17': 'Värmlands län',
  //'18': 'Örebro län',
  //'19': 'Västmanlands län',
  //'20': 'Dalarnas län',
  //'21': 'Gävleborgs län',
  //'22': 'Västernorrlands län',
  //'23': 'Jämtlands län',
  //'24': 'Västerbottens län',
  //'25': 'Norrbottens län'
//};

// Function to get URL parameters
//function getUrlParameter(name) {
  //name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  //const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  //const results = regex.exec(location.search);
  //return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
//}

// Function to apply custom styles from URL parameters
function applyCustomStyles() {
  const bgColor = getUrlParameter('bg');
  const textColor = getUrlParameter('text');
  const buttonColor = getUrlParameter('button');
  const buttonTxtColor = getUrlParameter('buttontext');
  const fontFamily = getUrlParameter('font');
  const state = getUrlParameter('state');

  // Apply background color
  if (bgColor) {
    document.documentElement.style.setProperty('--bg-color', `#${bgColor}`);
  }

  // Apply text color
  if (textColor) {
    document.documentElement.style.setProperty('--text-color', `#${textColor}`);
    document.body.style.color = `#${textColor}`;
  }

  // Apply button color
  if (buttonColor) {
    document.documentElement.style.setProperty('--button-color', `#${buttonColor}`);
  }

  // Apply button text color
if (buttonTxtColor) {
  document.documentElement.style.setProperty('--button-text-color', `#${buttonTxtColor}`);
}


  // Apply font family
  if (fontFamily) {
    document.documentElement.style.setProperty('--font-family', fontFamily);
  }

  // Return the state code if provided
  //return state || '01';
}

function updateStateTitle(countyCode) {
  const stateTitle = document.querySelector('.state-title');
  if (stateTitle) {
    stateTitle.textContent = STATE_NAMES[countyCode] || 'Okänt län';
  }
}

//async function fetchTrafficData(countyCode) {
  //try {
    //console.log('Fetching traffic data for county:', countyCode);
    
    //const [situationResponse, roadconditionResponse] = await Promise.all([
      //fetch(`${TRAFIKVERKET_API.situation}?county=${countyCode}`),
      //fetch(`${TRAFIKVERKET_API.roadcondition}?county=${countyCode}`)
    //]);

    //const situationData = await situationResponse.json();
   //const roadconditionData = await roadconditionResponse.json();

    //console.log('Situation data:', situationData);
    //console.log('Road condition data:', roadconditionData);

    //const situations = situationData.RESPONSE?.RESULT?.[0]?.Situation || [];
    //const roadconditions = roadconditionData.RESPONSE?.RESULT?.[0]?.RoadCondition || [];

    // Combine and process all traffic information
    //const allSituations = [
      //...situations.map(s => ({
        //...s,
        //type: 'situation'
      //})),
      //...roadconditions.map(r => ({
        //...r,
        //type: 'roadcondition'
      //}))
    //];

    //return {
      //situations: allSituations,
      //cameras: [],
      //roadconditions: []
    //};
  //} catch (error) {
    //console.error('Error fetching traffic data:', error);
    //return { situations: [], cameras: [], roadconditions: [] };
  //}
//}

//function createTrafficMarker(item, map) {
  //if (!item.Latitude || !item.Longitude) return null;

  //const marker = L.marker([item.Latitude, item.Longitude])
    //.addTo(map)
    //.bindPopup(`
      //<strong>${item.Title || 'Trafikstörning'}</strong><br>
      //${item.Description || ''}<br>
      //Status: ${item.Status || 'Aktiv'}<br>
      //Senast uppdaterad: ${new Date(item.ModifiedTime).toLocaleString('sv-SE')}
    //`);
  //return marker;
//}

function updateTrafficList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (items.length === 0) {
    const div = document.createElement('div');
    div.className = 'swiper-slide';
    div.innerHTML = `
      <div class="traffic-item">
        <strong>Inga aktiva trafikstörningar</strong>
        <p>Det finns för närvarande inga trafikstörningar att visa.</p>
      </div>
    `;
    container.appendChild(div);
  } else {
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'swiper-slide';
      div.innerHTML = `
        <div class="traffic-item">
          <strong>${item.Title || 'Trafikstörning'}</strong>
          <span class="traffic-status status-${item.Status?.toLowerCase() || 'active'}">
            ${item.Status || 'Aktiv'}
          </span>
          <p>${item.Description || ''}</p>
          <small>Senast uppdaterad: ${new Date(item.ModifiedTime).toLocaleString('sv-SE')}</small>
        </div>
      `;
      container.appendChild(div);
    });
  }

  // Initialize or update Swiper
  if (trafficSwiper) {
    trafficSwiper.update();
  } else {
    trafficSwiper = new Swiper('.traffic-swiper', {
      direction: 'horizontal', // or 'vertical'
      loop: true,
      slidesPerView: 1,
      spaceBetween: 10,
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
    });
  }
}

//async function updateMap(map, countyCode, markers) {
  // Clear existing markers
  //markers.forEach(marker => marker.remove());
  //markers.length = 0;

  // Update state title
  //updateStateTitle(countyCode);

  // Update map view
  //const coordinates = COUNTY_COORDINATES[countyCode];
  //if (coordinates) {
   // map.setView([coordinates.lat, coordinates.lng], coordinates.zoom);
  //}

  // Fetch and display traffic data
  //const trafficData = await fetchTrafficData(countyCode);
  
  // Add markers for each type of traffic information
  //trafficData.situations.forEach(item => {
    //if (item.Latitude && item.Longitude) {
      //const marker = createTrafficMarker(item, map);
     //markers.push(marker);
    //}
  //});

  // Update traffic list
  //updateTrafficList(trafficData.situations, 'traffic-list');
//}

//unction initializeMap() {
  //console.log('Initializing map...');
  //const map = L.map('map').setView([59.3293, 18.0686], 12); // Stockholm as default
  //L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //maxZoom: 19,
      //attribution: '&copy; OpenStreetMap contributors'
  //}).addTo(map);

  //return map;
//}

// Subscription Modal Functionality
const subscribeButton = document.getElementById('subscribe-button');
const subscribeModal = document.getElementById('subscribe-modal');
const modalClose = document.getElementById('modal-close');
const subscribeForm = document.getElementById('subscribe-form');

subscribeButton.addEventListener('click', (e) => {
  e.preventDefault();
  subscribeModal.style.display = 'block';
});

modalClose.addEventListener('click', () => {
  subscribeModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === subscribeModal) {
    subscribeModal.style.display = 'none';
  }
});

subscribeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    /*Jag lade till andra fält som behövs, fnamn, lname osv
    dock så behöver vi hämta organisationsnummer också här innan vi sparar undan all data*/
    fname: document.getElementById('subscriber-fname').value,
    lname: document.getElementById('subscriber-lname').value,
    email: document.getElementById('subscriber-email').value,
    passw: document.getElementById('subscriber-passw').value,
    phone: document.getElementById('subscriber-phone').value,
    start: new Date().toJSON().slice(0,10),
    countrycode: document.getElementById('subscriber-state').value,
    subtype: document.getElementById('subscriber-frequency').value,
    orgnr: '4444456789',//Exempel, denna får hämtas ifrån Iframen
    paymethod: 'Mastercard'//Exempel, denna får hämtas ifrån betalformuläret
  };
  
  // send this data to backend
  console.log('Subscription data:', formData);//Finns en funktion längre ner i filen
  /*Dock så behöver vi genomföra en betalning innan vi sparar undan användaren*/

  //exempel på anrop till functionen
  let result = await create_subscriber(formData);
  if (result['Success']){
    // Show success message and close modal
    alert('Tack för din prenumeration! Du kommer att få trafikinformation enligt vald frekvens.');
    subscribeModal.style.display = 'none';
    subscribeForm.reset();
  }
  else{
    console.log('Det var problem att skapa upp prenumeranten.', result['Message']);
  }
});

// Initialize map on page load
document.addEventListener('DOMContentLoaded', async () => {
  //Hämta orgnr ifrån URL
  let url_org = new URLSearchParams(window.location.search);
  let orgnr = url_org.get('orgnr');
  //Stoppa in orgnr i denna funktion när vi anropar
  let result = await load_organisation(orgnr);
  //Använd resultatet som vi får tillbaka
  document.getElementById('subscribe-button').style.backgroundColor  = result['Data']['primarycolor'];
  document.getElementById('login-button').style.backgroundColor  = result['Data']['primarycolor'];
  document.body.style.backgroundColor = result['Data']['secondarycolor'];
});
  // Initialize the map (already exported from map-init.js)
  //console.log('Map initialized:', map);

  // Fetch and display traffic situations
  //const situationUrl = `https://trafikverket.onrender.com/traffic/group3/situation?county=01`;
  //await getSituations(situationUrl);

  // Fetch and display cameras
  //const cameraUrl = `https://trafikverket.onrender.com/traffic/group3/cameras?county=01`;
  //await getCameras(cameraUrl);

  // Fetch and display road conditions
  //const roadConditionUrl = `https://trafikverket.onrender.com/traffic/group3/roadcondition?county=01`;
  //await getRoadConditions(roadConditionUrl);

  //const swiper = new Swiper('.traffic-swiper', {
    //direction: 'horizontal', // or 'vertical'
    //loop: true,
    //slidesPerView: 1,
    //spaceBetween: 10,
    //autoplay: {
        //delay: 3000, // 3 seconds
        //disableOnInteraction: false,
    //},
    //navigation: {
        //nextEl: '.swiper-button-next',
        //prevEl: '.swiper-button-prev',
    //},
    //pagination: {
        //el: '.swiper-pagination',
        //clickable: true,
    //},
  //});

  //console.log('Swiper initialized:', swiper);
//});

/*Anropa denna funktion och stoppa in 
data för användaren*/
/*Anropa denna funktion och stoppa in 
data för användaren*/
async function create_subscriber(data){

    let response = await fetch('https://bergstrom.pythonanywhere.com/create_user', {
    method: 'POST',
    headers: {//formatet på det som ska skickas över till databasen
        'Content-Type': 'application/json',
    },//Det här är vad vi skickar(en dict)
    body: JSON.stringify(data)
    });
    //Resultatet vi får tillbaka konverteras till json
    let jsonResult = await response.json();
    return jsonResult;//Och vi returnerar det till vem som anropade functionen
}

//Ladda organisationen ifråga och hämta dess värden
  async function load_organisation(orgnr){
    let data = {'orgnr': orgnr};
        let response = await fetch('https://bergstrom.pythonanywhere.com/get_organisation', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },//Här skickar med vår sessionscookie från serversidan
          //o det är ju då för att kontrollera VEM det är som är inloggad
          body: JSON.stringify(data)
      });
      let jsonResult = await response.json();
      return jsonResult;
  }