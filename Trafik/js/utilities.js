import { counties } from "./counties.js";

// Funktion för att formatera datum och tid från ISO-format 
// till ett mer förståeligt och läsbart format.
export function formatDateTime(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

// Funktion för att räkna ut riktningen som kamerorna visar - från grader till kompassriktningar som
// Norr - Nordväst, osv. Om riktningen inte finns - returneras "Okänd"
export function formatDirection(bearing) {
  if (bearing >= 337.5 || bearing < 22.5) {
    return "Norr";
  } else if (bearing >= 22.5 && bearing < 67.5) {
    return "Nordost";
  } else if (bearing >= 67.5 && bearing < 112.5) {
    return "Öst";
  } else if (bearing >= 112.5 && bearing < 157.5) {
    return "Sydost";
  } else if (bearing >= 157.5 && bearing < 202.5) {
    return "Syd";
  } else if (bearing >= 202.5 && bearing < 247.5) {
    return "Sydväst";
  } else if (bearing >= 247.5 && bearing < 292.5) {
    return "Väst";
  } else if (bearing >= 292.5 && bearing < 337.5) {
    return "Nordväst";
  } else {
    return "Okänd";
  }
}

export async function geocodeCity(city) {

  // Skapar en URL till OpenStreetMap Nominatim API för att söka efter staden.
  // encodeURIComponent ser till att stadens namn är korrekt formaterat i URL:en.
  // 'limit=1' innebär att vi bara vill ha det första (bästa) resultatet.
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`;
  try {
    // Här skickar vi en HTTP GET-förfrågan till API:et
    const response = await fetch(url);

    // Vänta på och läs av JSON-svaret från API:et
    const results = await response.json();

    // Här kontrolleras om vi fick några resultat
    if (results && results.length > 0) {

      // Här tar vi ut det första resultatet och plockar ut koordinaterna (latitud och longitud)
      const { lat, lon } = results[0];

      // Här returneras latitud och longitud som en array av flyttal/nummer
      return [parseFloat(lat), parseFloat(lon)];

    } else {

      // Om inga resultat hittades loggas en varning och null returneras
      console.warn('Inga koordinater hittades för stad:', city);
      return null;
    }
  } catch (error) {

    // Om något gick fel loggas felet och returnerar null
    console.error('Fel vid geokodning:', error);
    return null;
  }
}

export function getCountyCodeFromCoords(coords) {

  // Här kommer vi spara den närmaste länskoden - baserat på den stad som företagen skriver in
  let closestCounty = null;

  // Startvärdet av kortaste avståndet
  let shortestDistance = Infinity;

  // Här loopar vi igenom alla län i counties-objektet, code är länskoden och county är ett objekt som innehåller
  // information om länet och dess koordinater
  for (const [code, county] of Object.entries(counties)) {

    // coords är koordinaterna för staden
    const [lat1, lon1] = coords;

    // county.coords är det sparade koordinatparet för länets centrum
    const [lat2, lon2] = county.coords;

    // Här beräknas det geometriska avståndet mellan stadens koordinater och länets mittpunkt,
    // med hjälp av Pythagoras sats. "Math.hypot(a, b)" är ett inbyggt sätt för att räkna: √(a² + b²)
    const distance = Math.hypot(lat2 - lat1, lon2 - lon1);

    // Om detta län är närmare än et tidigare närmaste länet - så uppdateras shortestDistance och sparas länskoden
    if (distance < shortestDistance) {
      shortestDistance = distance;
      closestCounty = code;
    }
  }

  // När loopen är klar så returneras den länskod som ligger närmast de angivna koordinaterna för staden
  return closestCounty;
}