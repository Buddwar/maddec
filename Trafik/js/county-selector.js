// Importerar kartan, kluster (grupperingar), län (counties) och funktioner.
import { map, situationCluster, cameraCluster, roadConditionLines } from "./map-init.js";
import { getSituations } from "./situations.js";
import { getCameras } from "./cameras.js";
import { getRoadConditions } from "./road-conditions.js";
import { counties } from "./counties.js";

// Exportera funktion för att hämta URL:erna för det valda länet, baserat på länskoden
// som finns i counties.js.
export function getUrlsForCounty(selectedCode) {
  const countyData = counties[selectedCode];

  if (!countyData) {
    console.error('Ogiltig länskod');
    return;
  }

  // Bygger och hämtar upp de nya API:erna baserat på länskoden som finns i counties.
  const newSituationUrl = `https://trafikverket.onrender.com/traffic/group3/situation?county=${selectedCode}`;
  const newCameraUrl = `https://trafikverket.onrender.com/traffic/group3/cameras?county=${selectedCode}`;
  const newRoadConditionUrl = `https://trafikverket.onrender.com/traffic/group3/roadcondition?county=${selectedCode}`;

  // Returnera de nya URL:erna baserat på länskoden.
  return { newSituationUrl, newCameraUrl, newRoadConditionUrl };
}

// Skapar Leaflet-kontrollen för länsval med dropdown-meny på kartan.
const CountySelector = L.Control.extend({
  onAdd: function (map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

    const select = L.DomUtil.create('select', '', container); 
    select.style.padding = '1px';
    select.style.margin = '1px';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';  
    defaultOption.textContent = 'Välj län';
    defaultOption.disabled = true;  
    defaultOption.selected = true;  
    select.appendChild(defaultOption);

    // Skapar en lista med län och sorterar den alfabetiskt
    const sortedCounties = Object.entries(counties).sort((a, b) => a[1].name.localeCompare(b[1].name)); 

    sortedCounties.forEach(([code, data]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = data.name;
      select.appendChild(option);
    });

    // Förval av län, baserat på länskoden för länet - det är detta länet som visas när kartan startas upp.
    // Om tidningsförlaget befinner sig i Varberg -> så visas hela Hallands läns trafikhändelser, men
    // koordinaterna i map-init.js bestämmer staden som ska visas. 
    const { newSituationUrl, newCameraUrl, newRoadConditionUrl } = getUrlsForCounty('13'); // Här ändrar tidningen till det län som ska visas på kartan.
    getSituations(newSituationUrl);
    getCameras(newCameraUrl);
    getRoadConditions(newRoadConditionUrl);

    // Hindra att klick på dropdownen "läcker"
    L.DomEvent.disableClickPropagation(container);

    // När användaren väljer ett nytt län, uppdateras kartan och data till det valda länet baserat på länskoden, 
    // och skickas till koordinaterna för residensstaden.
    select.addEventListener('change', function () {
      const selectedCode = this.value;
      const { coords } = counties[selectedCode];

      // Flytta kartan till vald plats via koordinater, ställ in zoom-nivå.
      map.setView(coords, 10);

      // Ta bort tidigare data vid val av nytt län (så användaren bara ser ett läns trafikdata i taget).
      situationCluster.clearLayers();
      cameraCluster.clearLayers();
      roadConditionLines.forEach(line => map.removeLayer(line));
      roadConditionLines.length = 0;

      // Hämta URL:erna och uppdatera datan för trafikhändelser, kameror och vägförhållanden
      const { newSituationUrl, newCameraUrl, newRoadConditionUrl } = getUrlsForCounty(selectedCode);

      getSituations(newSituationUrl);
      getCameras(newCameraUrl);
      getRoadConditions(newRoadConditionUrl);
    });

    // Trigga förvald laddning av data för valt län vid selected.value på rad 54, då startar man vid residensstaden för länet.
    //select.dispatchEvent(new Event('change')); <--- Denna behövs eventuellt inte.

    return container;
  },
});

// Lägg till kontrollen på kartan
map.addControl(new CountySelector({ position: 'topright' }));
