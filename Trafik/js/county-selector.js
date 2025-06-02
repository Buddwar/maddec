// Importerar kartan, kluster (grupperingar), län (counties) och funktioner.
import { map, situationCluster, cameraCluster, roadConditionLines } from "./map-init.js";
import { getSituations } from "./situations.js";
import { getCameras } from "./cameras.js";
import { getRoadConditions } from "./road-conditions.js";
import { counties } from "./counties.js";
import { geocodeCity, getCountyCodeFromCoords } from "./utilities.js";

// Exportera funktion för att hämta URL:erna för det valda länet, baserat på länskoden (selectedCode) som finns för länet.
export function getUrlsForCounty(selectedCode) {
  console.log("getUrlsForCounty called with:", selectedCode);

  // Hämtar länets data från counties-objektet - namn, koordinater för varje län.
  const countyData = counties[selectedCode];

  // Fel loggas om länskoden inte finns i counties-objektet.
  if (!countyData) {
    console.error('Ogiltig länskod');
    return;
  }

  // Nya URL:er till API:er byggs upp, där länskoden (selectedCode) används för att hämta det specifika länets
  // trafikhändelser, kameror och väglag.
  const newSituationUrl = `https://trafikverket.onrender.com/traffic/group3/situation?county=${selectedCode}`;
  const newCameraUrl = `https://trafikverket.onrender.com/traffic/group3/cameras?county=${selectedCode}`;
  const newRoadConditionUrl = `https://trafikverket.onrender.com/traffic/group3/roadcondition?county=${selectedCode}`;

  // Loggar URL:erna (för felsökning)
  console.log("URLs:", { newSituationUrl, newCameraUrl, newRoadConditionUrl });

  // Returnerar URL:erna som ett objekt, så de kan användas i andra delar när de anropas.
  return { newSituationUrl, newCameraUrl, newRoadConditionUrl };
}

// Funktion som exporteras och är asynk - då den använder await för att vänta på ett nätverksanrop.
export async function loadCountyFromCity(city) {

  // Här anropas funktionen geocodeCity från utilities.js, som använder Nominatim (OpenStreetMap) för att
  // konvertera staden som tidningarna sätter till geografiska koordinater (coords). 
  const coords = await geocodeCity(city);
  if (!coords) {
    console.warn('Kunde inte hitta koordinater för staden:', city);
    return;
  }

  // Här anropas funktionen getCountyCodeFromCoords från utilities.js, som tar koordinaterna och
  // kollar vilket län som är närmast de koordinater som finns för staden som företagen angivit.
  const countyCode = getCountyCodeFromCoords(coords);

  // Om ingen matchande länskod hittas - avslutas funktionen med en varning.
  if (!countyCode) {
    console.warn('Kunde inte hitta län för koordinaterna:', coords);
    return;
  }

  // Här uppdateras URL:erna till API:erna med den länskod som matchats, här anropas funktionen
  // getUrlsForCounty som ligger överst i denna filen (county-selector.js).
  const { newSituationUrl, newCameraUrl, newRoadConditionUrl } = getUrlsForCounty(countyCode);

  // Här flyttas kartan till stadens koordinater och hämtas trafikdata för länet,
  // samt att tidigare data rensas, alltså trafikhändelser, kameror och väglag.
  map.setView(coords, 10);
  situationCluster.clearLayers();
  cameraCluster.clearLayers();
  roadConditionLines.forEach(line => map.removeLayer(line));
  roadConditionLines.length = 0;

  // Här anropar vi de tre funktionerna som finns i respektive filer: cameras.js, situations.js och road-conditions.js.
  // Varje funktion inkluderar de nya URL:erna med den nya - korrekta länskoden.
  getSituations(newSituationUrl);
  getCameras(newCameraUrl);
  getRoadConditions(newRoadConditionUrl);
}

// Skapar Leaflet-kontrollen för länsval med dropdown-meny på kartan.
const CountySelector = L.Control.extend({
  onAdd: function (map) {

    // En container-div skapas upp som Leaflet-kontrollens yta på kartan, med CSS-klasser för att ändra utseendet
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

    // En <select>-dropdwon skapas upp inuti containern, där användaren kan välja län.
    // Samt padding och margin sätt till 1px runt dropdownen
    const select = L.DomUtil.create('select', '', container);
    select.style.padding = '1px';
    select.style.margin = '1px';

    // Skapar här upp ett default 'placeholder'-alternativ som är valt och inaktiverat på dropdownen,
    // där texten "Välj län" visas. "Välj län" kan sedan inte väljas i dropdownen, samt att "Väl län"
    // är förvalt. Sedan används appendChild för att lägga till "Välj län" i dropdownen
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Välj län';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Här hämtas länsdata och sorterar länsnamnen i alfabetisk ordning från A-Ö 
    const sortedCounties = Object.entries(counties).sort((a, b) => a[1].name.localeCompare(b[1].name));

    // Här skapas ett <option>-element för varje län, med länskoden som värde och länets namn som text.
    // Dessa läggs sedan till i dropdownen med appendChild.
    sortedCounties.forEach(([code, data]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = data.name;
      select.appendChild(option);
    });

    // Hindra klick på dropdownen "läcker"
    L.DomEvent.disableClickPropagation(container);

    select.addEventListener('change', function () {

      // När användaren väljer ett län i dropdown-menyn så hämtas länskoden
      const selectedCode = this.value;

      // Koordinaterna till residensstaden för länet hämtas från counties-objektet
      const { coords } = counties[selectedCode];

      // Flyttar kartan till rätt stad/koordinater med en zoomnivå på 10.
      map.setView(coords, 10);

      // Tidigare trafikhändelser, kameror och väglag rensas
      situationCluster.clearLayers();
      cameraCluster.clearLayers();
      roadConditionLines.forEach(line => map.removeLayer(line));
      roadConditionLines.length = 0;

      // Här skapas nya URL:er upp till API:erna baserat på länskoden för det län som användaren väljer
      const { newSituationUrl, newCameraUrl, newRoadConditionUrl } = getUrlsForCounty(selectedCode);

      // Här anropas funktionerna med de nya URL:erna, där trafikhändelser, kameror och väglag visas
      // för det län som valts av användaren
      getSituations(newSituationUrl);
      getCameras(newCameraUrl);
      getRoadConditions(newRoadConditionUrl);
    });

    // Här returneras HTML-elementet som innehåller dropdown-menyn till Leaflet-kontrollen
    return container;
  },
});

// Lägg till kontrollen på kartan
map.addControl(new CountySelector({ position: 'topright' }));
