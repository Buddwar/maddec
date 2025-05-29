// Importerar markörer för kameror och situationer och väglagslinjer samt kartan, för att göra dessa klickbara.

import { situationMarkers } from "./situations.js";
import { cameraMarkers } from "./cameras.js";
import { roadConditionLines } from "./map-init.js";
import { map } from "./map-init.js";

// Event listener för att hantera klick på markörer som öppnar popup-fönster,
    document.addEventListener('click', function onClick(e) {

        // Här kollar vi om det som klickats på är en <a>-länk,
        // denna <a>-länk måste ha attributen "data-index" och "data-type",
        // annars ignoreras klicket
        if (e.target.tagName === 'A' && e.target.dataset.index && e.target.dataset.type) {

            // Här förhindras standardbeteendet för länkar - som navigering till en annan sida
            e.preventDefault();

            // Här hämtas index och typen av objektet
            const index = +e.target.dataset.index;
            const type = e.target.dataset.type;
    
            // Beroende av typen av markör så väljs rätt array och rätt objekt med hjälp av index
            let selected;
            if (type === 'situation') {
                selected = situationMarkers[index];
            } else if (type === 'camera') {
                selected = cameraMarkers[index];
            } else if (type === 'road') {
                selected = roadConditionLines[index];
            }
    
            // Om markören hittas - öppnas popup och kartan flyttas till markörens position,
            // detta gäller dock inte för väglag - eftersom det är en polyline och inte en punkt
            if (selected) {
                selected.openPopup();
                if (type !== 'road') {
                    map.setView(selected.getLatLng(), 16);
                }
            }
    
            document.removeEventListener('click', onClick);
        }
    });