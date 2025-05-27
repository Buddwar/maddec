
import { geocodeCityWithCounty, getCountyCodeFromCountyName } from './utilities.js';
import { countySelector } from "./county-selector.js"

// Initiera Leaflet-kartan, detta är taget från Leaflet direkt.
// Vi exporterar kartan, sätter koordinaterna för vart kartan ska visas först, tillsammans med zoom-nivån.
export const map = L.map('map').setView([57.10713, 12.25340], 13); //Här kan tidningarna själva skriva in koordinaterna för staden de befinner sig i - staden som visas på kartan direkt.

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attributionControl: true,
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Klustergrupp för situationer (alltså klumpar vi ihop situationer)
export const situationCluster = L.markerClusterGroup({
  showCoverageOnHover: false //Stänger av det blåa området som visas vid hovring över klustergruppen på kartan.
});

// Klustergrupp för kameror (alltså klumpar vi ihop kameror)
export const cameraCluster = L.markerClusterGroup({
  showCoverageOnHover: false //Stänger av det blåa området som visas vid hovring över klustergruppen på kartan.
});
export const roadConditionLines = []; // En tom array som innehåller polylines från Leaflet, vi sparar dessa för att sedan kunna ta bort dem vid byte av län.

// Funktion för att tvinga Leaflet att uppdatera kartans storlek vid fönsterändring
window.addEventListener('resize', function() {
  if (map) {
    map.invalidateSize(); // Tvinga Leaflet att uppdatera kartans storlek
  }
});

export async function initializeMapWithCity(city) {
  if (!city) {
    map.setView([57.10713, 12.25340], 13);
    return null;
  }

  const result = await geocodeCityWithCounty(city);

  if (result && result.coords && result.countyName) {
    const { coords, countyName } = result;
    map.setView(coords, 13);

    const countyCode = getCountyCodeFromCountyName(countyName);
    if (countyCode) {
      // Programmatisk uppdatering av länsväljare och data
      countySelector.setCountyCode(countyCode);
      return countyCode;
    } else {
      console.warn('Kunde inte hitta länskod för länet:', countyName);
      return null;
    }
  } else {
    map.setView([57.10713, 12.25340], 13);
    return null;
  }
}

