// Importerar karta och kluster (grupperingar).
import { map, cameraCluster } from "./map-init.js"

// Importera funktion för kamerornas riktning.
import { formatDirection } from "./utilities.js";

// Exporterar en array med markörerna.
export const cameraMarkers = [];

// Funktion för att hämta kameror från API:et och lägga till dem på kartan, tillsammans med en pop-up
// med data från API som kameranamn och väg där kameran finns.
export async function getCameras(cameraUrl) {
    try {
      const res = await fetch(cameraUrl);
      const data = await res.json();
  
      const cameras = data.RESPONSE.RESULT[0].TrafficSafetyCamera;
  
      // Loopar igenom varje kamera
      cameras.forEach(cam => {
        const geometry = cam.Geometry;
        
        if (!geometry || !geometry.WGS84) {
          console.log('Ingen geometri eller WGS84 för kamera:', cam); // Kontrollerar här om geometri finns och skriver ut i konsolen om den inte gör det
          return;
        }
  
        // Extrahera koordinater från WGS84
        const wgs84 = geometry.WGS84;
        const match = wgs84.match(/\(([^)]+)\)/);
        if (!match) return;
  
        const [lon, lat] = match[1].split(' ').map(Number);

        //Hämtar värdet av bearing från kameror i API:et. Bearing är i nummer från 0-359 grader,
        //och är alltså riktningen där kameran pekar åt.
        const bearing = cam.Bearing;

        //Kollar om bearing är av typen "number", och är den det så anropar vi funktionen för att
        //omvandla de grader som finns i bearing till Norr, Öst, Nordöst osv. Om bearing är "undefined"
        //eller inte finns - så visas "Okänd".
        const direction = typeof bearing === 'number' ? formatDirection(bearing) : 'Okänd';
  
        // Skapar popup-innehåll med namn på kameran (jag tror det är namnet iallafall?)
        // och dess vägnr
        const popupContent = `
          <div class="popup-cameraname"<strong>${cam.Name || 'Okänd kamera'}</strong><br></div>
          <div class="popup-camera-roadnr"><strong>Vägnr: </strong> ${cam.RoadNumber || 'Okänd'}<br></div>
          <div class="popup-camera-direction"><strong>Riktning: </strong> ${direction}<br></div>
        `;
  
        // Skapa Leaflet-divIcon med Bootstrap Icon
        // och lägg till den på kartan
        const cameraIcon = L.icon({
          iconUrl: 'images/icon-camera.svg', // Updated path
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
  
        // Lägg till markören på kartan med popup-innehåll
        // och lägg till den i klustergruppen för kameror. Klassnamn
        // för att lägga till CSS på popupen.
        const marker = L.marker([lat, lon], { icon: cameraIcon })
          .bindPopup(popupContent, { className: 'camera-popup', autopan: true })
          .addTo(cameraCluster);

          cameraCluster.addLayer(marker);
          cameraMarkers.push(marker);
      });
    } catch (err) {
      console.error('Fel vid hämtning av kameror:', err);
    }

    // Lägg till kameror på kartan efter att de har hämtats
    // och markerats med ikoner, så att de visas i kluster (grupperingar).
    map.addLayer(cameraCluster);
  }