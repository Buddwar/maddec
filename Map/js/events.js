// Importerar markörer för kameror och situationer och väglagslinjer samt kartan, för att göra dessa klickbara.

import { situationMarkers } from "./situations.js";
import { cameraMarkers } from "./cameras.js";
import { roadConditionLines } from "./map-init.js";
import { map } from "./map-init.js";

// Event listener för att hantera klick på markörer som öppnar popup-fönster,
    // ska sätta mig in i koden mer, denna är tagen från Leaflet.
    document.addEventListener('click', function onClick(e) {
        if (e.target.tagName === 'A' && e.target.dataset.index && e.target.dataset.type) {
            e.preventDefault();
            const index = +e.target.dataset.index;
            const type = e.target.dataset.type;
    
            let selected;
            if (type === 'situation') {
                selected = situationMarkers[index];
            } else if (type === 'camera') {
                selected = cameraMarkers[index];
            } else if (type === 'road') {
                selected = roadConditionLines[index];
            }
    
            if (selected) {
                selected.openPopup();
                if (type !== 'road') {
                    map.setView(selected.getLatLng(), 16);
                }
            }
    
            document.removeEventListener('click', onClick);
        }
    });