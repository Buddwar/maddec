//Importera map (kartan), situationCluster (grupperingarna för markörer), formatDateTime för karta, grupperingar och funktionen för att formatera
// datum samt tid från ISO-format.
import { map, situationCluster } from "./map-init.js";
import { formatDateTime } from './utilities.js';


// Exportera en array med markörer.
export const situationMarkers = [];

// Funktionen i sin helthet hämtar data från API:et för trafikhändelser, sorterar ut de med "Stor påverkan" och "Mycket stor påverkan",
// skapar även pop-up med data. Lägger till ikoner som markörer för att visa om det är vägarbete, hinder eller olycka.
export async function getSituations(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        const situations = data.RESPONSE.RESULT[0].Situation;

        // Loopar igenom varje situation
        situations.forEach(sit => {
            if (!sit.Deviation) return;

            // Loopar igenom varje situation med Stor påverkan eller Mycket stor påverkan
            sit.Deviation.forEach(dev => {
                if (dev.SeverityText !== 'Stor påverkan' && dev.SeverityText !== 'Mycket stor påverkan') return;

                // Kontrollera att geometrin finns och innehåller en punkt i WGS84-format
                if (dev.Geometry && dev.Geometry.Point && dev.Geometry.Point.WGS84) {
                    const match = dev.Geometry.Point.WGS84.match(/\(([^)]+)\)/);
                    if (match) {
                        const [lon, lat] = match[1].split(' ').map(Number);

                        // Skapa popup-innehåll med information om situationen
                        // och dess påverkan. Klasser tillagda här för att lägga till CSS. Detta kan ändras
                        // enkelt - bara testar lite just nu. Först kollar vi påverkan, och kan i CSS lägga till röd/orange
                        // bakgrund beroende på påverkan.
                        const popupContent = `
                          <div class="popup-severity ${dev.SeverityText?.toLowerCase() === 'mycket stor påverkan' ? 'severity-very-high' : dev.SeverityText?.toLowerCase() === 'stor påverkan' ? 'severity-high' : ''}">
                            <strong>${dev.SeverityText || 'Ingen påverkan angiven'}</strong><br>
                          </div>
                          <div class="popup-roadname"><strong>${dev.RoadName || dev.RoadNumber || 'Okänd väg'}</strong><br></div>
                          <div class="popup-messagetype"><strong>${dev.MessageType || 'Ingen meddelandetyp angiven'}</strong><br></div>
                          ${dev.TrafficRestrictionType ? `<div class="popup-restriction">${dev.TrafficRestrictionType || 'Ingen trafikrestriktion angiven'}<br></div>` : ''}
                          ${dev.AffectedDirection ? `<div class ="popup-direction"><strong>Riktning: </strong> ${dev.AffectedDirection || 'Ingen riktning angiven'}<br></div>` : ''}
                          <div class="popup-message">${dev.Message || 'Inget meddelande angivet'}<br></div>
                          <div class="popup-starttime"><strong>Starttid:</strong> ${dev.CreationTime ? formatDateTime(dev.CreationTime) : 'Ingen tid angiven'}<br></div>
                          <div class="popup-endtime"><strong>Sluttid:</strong> ${dev.EndTime ? formatDateTime(dev.EndTime) : 'Ingen tid angiven'}<br></div>
                        `;

                        // Ikoner för olika situationer och påverkan, dessa kommer att ändras - bootstrap används i nuläget för test
                        let iconUrl;
                        if (dev.MessageType?.toLowerCase() === 'vägarbete') {
                          iconUrl = dev.SeverityText?.toLowerCase() === 'mycket stor påverkan'
                            ? 'images/icon-roadwork-red.svg'
                            : 'images/icon-roadwork-orange.svg';
                          
                        } else if (dev.MessageType?.toLowerCase() === 'olycka') {
                          iconUrl = dev.SeverityText?.toLowerCase() === 'mycket stor påverkan'
                            ? 'images/icon-accident-red.svg'
                            : 'images/icon-accident-orange.svg';

                        } else if (dev.MessageType?.toLowerCase() === 'hinder') {
                          iconUrl = dev.SeverityText?.toLowerCase() === 'mycket stor påverkan'
                            ? 'images/icon-obstacle-red.svg'
                            : 'images/icon-obstacle-orange.svg';
                        }

                        // Skapa Leaflet-divIcon med Bootstrap Icon om vi har en giltig ikon
                        if (iconUrl) {
                          const customIcon = L.icon({
                            iconUrl,
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                          });

                          // Lägg till markören på kartan, klassnamn finns med
                          // för att lägga till CSS på popupen.
                          const marker = L.marker([lat, lon], { icon: customIcon })
                            .bindPopup(popupContent, { className: 'situation-popup', autopan: true })
                            .addTo(situationCluster);

                            situationMarkers.push(marker);
                            situationCluster.addLayer(marker);

                        }
                      }
                    } else {
                      console.log('Ingen geometri tillgänglig för denna avvikelse');
                    }
                  });
                });
              } catch (err) {
                console.error('Fel vid hämtning av situationer:', err);
              }
              // Lägg till situationer på kartan efter att de har hämtats
              // och markerats med ikoner, så att de visas i kluster (grupperingar)
              map.addLayer(situationCluster);
            }