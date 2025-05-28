
// Importerar kartan, kluster (grupperingar), län (counties) och funktioner.
import { map, situationCluster, cameraCluster, roadConditionLines } from "./map-init.js";
import { getSituations } from "./situations.js";
import { getCameras } from "./cameras.js";
import { getRoadConditions } from "./road-conditions.js";
import { counties } from "./counties.js";
import { geocodeCity, getCountyCodeFromCoords } from "./utilities.js";

// Exportera funktion för att hämta URL:erna för det valda länet, baserat på länskoden
export function getUrlsForCounty(selectedCode) {
  const countyData = counties[selectedCode];

  if (!countyData) {
    console.error('Ogiltig länskod');
    return;
  }

  const newSituationUrl = `https://trafikverket.onrender.com/traffic/group3/situation?county=${selectedCode}`;
  const newCameraUrl = `https://trafikverket.onrender.com/traffic/group3/cameras?county=${selectedCode}`;
  const newRoadConditionUrl = `https://trafikverket.onrender.com/traffic/group3/roadcondition?county=${selectedCode}`;

  return { newSituationUrl, newCameraUrl, newRoadConditionUrl };
}

// --- Exporterad funktion utanför kontrollen ---
export async function loadCountyFromCity(city) {
  const coords = await geocodeCity(city);
  if (!coords) {
    console.warn('Kunde inte hitta koordinater för staden:', city);
    return;
  }

  const countyCode = getCountyCodeFromCoords(coords);
  if (!countyCode) {
    console.warn('Kunde inte hitta län för koordinaterna:', coords);
    return;
  }

  const { newSituationUrl, newCameraUrl, newRoadConditionUrl } = getUrlsForCounty(countyCode);

  // Flytta kartan till stadens koordinater och hämta trafikdata för länet
  map.setView(coords, 10);
  situationCluster.clearLayers();
  cameraCluster.clearLayers();
  roadConditionLines.forEach(line => map.removeLayer(line));
  roadConditionLines.length = 0;

  getSituations(newSituationUrl);
  getCameras(newCameraUrl);
  getRoadConditions(newRoadConditionUrl);
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

    const sortedCounties = Object.entries(counties).sort((a, b) => a[1].name.localeCompare(b[1].name));
    sortedCounties.forEach(([code, data]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = data.name;
      select.appendChild(option);
    });

    // OBS! Ta bort hårdkodad initial data-laddning här (tidigare var det t.ex. '13' för Halland)
    // Vi förlitar oss på att loadCountyFromCity anropas utifrån

    // Hindra klick på dropdownen "läcker"
    L.DomEvent.disableClickPropagation(container);

    select.addEventListener('change', function () {
      const selectedCode = this.value;
      const { coords } = counties[selectedCode];

      map.setView(coords, 10);

      situationCluster.clearLayers();
      cameraCluster.clearLayers();
      roadConditionLines.forEach(line => map.removeLayer(line));
      roadConditionLines.length = 0;

      const { newSituationUrl, newCameraUrl, newRoadConditionUrl } = getUrlsForCounty(selectedCode);
      getSituations(newSituationUrl);
      getCameras(newCameraUrl);
      getRoadConditions(newRoadConditionUrl);
    });

    return container;
  },
});

// Lägg till kontrollen på kartan
map.addControl(new CountySelector({ position: 'topright' }));
