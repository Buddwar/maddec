import { counties } from './counties.js';
import { map, situationCluster, cameraCluster, roadConditionLines } from "./map-init.js";
import { getSituations } from "./situations.js";
import { getCameras } from "./cameras.js";
import { getRoadConditions } from "./road-conditions.js";

let countySelectElement;

const CountySelector = L.Control.extend({
  onAdd: function (map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

    countySelectElement = L.DomUtil.create('select', '', container);
    countySelectElement.style.padding = '1px';
    countySelectElement.style.margin = '1px';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Välj län';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    countySelectElement.appendChild(defaultOption);

    const sortedCounties = Object.entries(counties).sort((a, b) => a[1].name.localeCompare(b[1].name));
    sortedCounties.forEach(([code, data]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = data.name;
      countySelectElement.appendChild(option);
    });

    countySelectElement.addEventListener('change', function () {
      const selectedCode = this.value;
      setCountyCode(selectedCode);
    });

    L.DomEvent.disableClickPropagation(container);

    return container;
  },
});

// Funktion för att programatiskt sätta län och ladda data
export function setCountyCode(code) {
  if (!code || !counties[code]) {
    console.warn('Ogiltig länskod i setCountyCode:', code);
    return;
  }

  if (countySelectElement) {
    countySelectElement.value = code;
  }

  const { coords } = counties[code];
  map.setView(coords, 10);

  // Rensa tidigare lager
  situationCluster.clearLayers();
  cameraCluster.clearLayers();
  roadConditionLines.forEach(line => map.removeLayer(line));
  roadConditionLines.length = 0;

  // Hämta nya data-URL:er baserat på länskod
  const newSituationUrl = `https://trafikverket.onrender.com/traffic/group3/situation?county=${code}`;
  const newCameraUrl = `https://trafikverket.onrender.com/traffic/group3/cameras?county=${code}`;
  const newRoadConditionUrl = `https://trafikverket.onrender.com/traffic/group3/roadcondition?county=${code}`;

  getSituations(newSituationUrl);
  getCameras(newCameraUrl);
  getRoadConditions(newRoadConditionUrl);
}

export const countySelector = new CountySelector({ position: 'topright' });
map.addControl(countySelector);
