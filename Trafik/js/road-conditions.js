//Importerar kartan, arrayen för väglagslinjerna och funktionen för att formatera datum & tid från ISO-format.
import {map, roadConditionLines} from "./map-init.js"
import { formatDateTime } from "./utilities.js";

// Funktion för att hämta vägförhållanden och lägga till dem på kartan
// och skapa linjer med olika färger beroende på vägförhållandena, samt pop-up med data
// gällande väglaget. 
export async function getRoadConditions(roadConditionUrl) {
    try {
        if (!roadConditionUrl) {
            throw new Error('roadConditionUrl is undefined');
        }

        console.log('Fetching road conditions from:', roadConditionUrl); // Debugging
        const res = await fetch(roadConditionUrl);
        const data = await res.json();

        const roadConditions = data.RESPONSE.RESULT[0].RoadCondition;

        // Loopar igenom varje vägförhållande
        // och kontrollerar om geometrin finns
        roadConditions.forEach(cond => {
            const geometry = cond.Geometry?.WGS84;
            const locationText = cond.LocationText;
            if (geometry) {
              //console.log("Geometri: ", geometry);
  
              // Extrahera koordinater från geometrin
              // och konvertera dem till Leaflet-format [lat, lon].
              // Data i API är LINESTRING.
              const coords = geometry
                .replace('LINESTRING(', '')
                .replace(')', '')
                .split(', ')
                .map(pair => {
                  const [lon, lat] = pair.split(' ').map(Number);
                  return [lat, lon]; // Leaflet kräver [lat, lon]
                })

                // Filtrera bort ogiltiga koordinater
                // (t.ex. NaN-värden)
                .filter(coord => !isNaN(coord[0]) && !isNaN(coord[1]));
  
              // Om inga giltiga koordinater finns, hoppa över detta objekt
              if (coords.length === 0) {
                console.log("Inga giltiga koordinater hittades för denna geometri.");
                return;
              }
  
              // Bestäm färg baserat på ConditionCode 1-4, färgerna kan vi ändra
              // senare. Nu går de från grönt-rött.
              // och sätt en standardfärg om inget ConditionCode anges
              let color = 'green'; // Standardfärg om inget ConditionCode anges
              const conditionCode = cond.ConditionCode;

            switch (conditionCode) {
              case 1:
                color = 'green'; // Bra vägförhållande
                break;
              case 2:
                color = 'yellow'; // Något dåliga vägförhållanden
                break;
              case 3:
                color = 'orange'; // Dåliga vägförhållanden
                break;
              case 4:
                color = 'red'; // Mycket dåliga vägförhållanden
                break;
            }

            // Text baserat på väglaget, 1 = Normalt, 2 = Något dåligt, osv.
            let conditionText = '';
            switch (conditionCode) {
              case 1:
                conditionText = 'Normalt';
                break;
              case 2:
                conditionText = 'Risk för dåligt';
                break;
              case 3:
                conditionText = 'Dåligt';
                break;
              case 4:
                conditionText = 'Mycket dåligt';
                break;
            }
  
              // Skapa popup-innehåll med information om vägförhållandet
              // och dess vägnr. Påbörjat lägga till klasser för Väglag i CSS.
              // Färgerna ska variera i samma färger som vägen, 1-4 = Grönt-Rött.
              // Klasser läggs till beroende på vilket condition vägen är i, alltså ConditionText,
              // i CSS läggs färg till i popupen beroende på ConditionText-klasserna som tilldelats.
              const popupContent = `
                <div class="popup-conditiontext ${conditionText?.toLowerCase() === 'normalt' ? 'condition-normal' : conditionText?.toLowerCase() === 'risk för dåligt' ? 'condition-medium' : 
                  conditionText?.toLowerCase() === 'dåligt' ? 'condition-bad' : conditionText?.toLowerCase() === 'mycket dåligt' ? 'condition-very-bad' : ''}">
                       <strong>${conditionText || 'Ingen påverkan angiven'}</strong><br>
                </div>
                <div class="popup-condition-roadname"><strong>${locationText}</strong><br></div>
                ${cond.Cause ? `<div class="popup-cause"><strong>${cond.Cause}</strong><br></div>` : ''}
                <div class="popup-condition-info"><strong>Väglag: </strong>${cond.ConditionInfo || 'Ingen info'}<br></div>
                ${cond.Warning ? `<div class="popup-warning"><strong>${cond.Warning}</strong><br></div>` : ''}
                <div class="popup-time-update"><strong>Uppdaterat: </strong>${cond.StartTime ? formatDateTime(cond.StartTime) : 'Ingen tid angiven'}<br></div>
              `;
  
              // Skapar och lägger till polyline (väglinjerna) på kartan med popup-innehåll
              const polyline = L.polyline(coords, {
                color: color,
                weight: 5,
                opacity: 0.8
              }).bindPopup(popupContent, { className : 'condition-popup', autopan: true });
  
              polyline.addTo(map); // Lägger till polyline (väglinjen) till kartan.
              roadConditionLines.push(polyline); // Lägg till i arrayen för att kunna rensa senare

            } else {
              console.log("Ingen geometri hittades i objektet.");
            }
          });
    } catch (err) {
      console.error('Fel vid hämtning av vägförhållanden:', err);
    }
  }
  
  getRoadConditions();