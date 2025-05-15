// Initiera Leaflet-kartan, detta är taget från Leaflet direkt.
// Vi exporterar kartan, sätter koordinaterna för vart kartan ska visas först, tillsammans med zoom-nivån.
export const map = L.map('map').setView([59.33263, 18.06761], 13); //Här kan tidningarna själva skriva in koordinaterna för staden de befinner sig i.

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attributionControl: true,
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

export const situationCluster = L.markerClusterGroup(); // Klustergrupp för situationer (alltså klumpar vi ihop situationer)
export const cameraCluster = L.markerClusterGroup(); // Klustergrupp för kameror (alltså klumpar vi ihop kameror)
export const roadConditionLines = []; // En tom array som innehåller polylines från Leaflet, vi sparar dessa för att sedan kunna ta bort dem vid byte av län.

// Funktion för att tvinga Leaflet att uppdatera kartans storlek vid fönsterändring
window.addEventListener('resize', function() {
  if (map) {
    map.invalidateSize(); // Tvinga Leaflet att uppdatera kartans storlek
  }
});
