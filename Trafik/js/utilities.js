import { counties } from "./counties";

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

// Funktion för att formatera grader för kamerors riktning till kompassriktning.
//Antingen kan vi ha Norr, Väst, Syd och Öst som nedan.

//export function formatDirection(bearing) {
  //if (bearing >= 45 && bearing < 135) {
    //return "Öst";
  //} else if (bearing >= 135 && bearing < 225) {
    //return "Syd";
  //} else if (bearing >= 225 && bearing < 315) {
    //return "Väst";
  //} else {
    //return "Norr";
  //}
//}

//Eller så kan vi ha mer specifikt, som nedan. Där vi visar mer precis riktning för åt
//vilket håll som kameran riktas åt.
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
  const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`;

  try {
    const searchResponse = await fetch(searchUrl);
    const searchResults = await searchResponse.json();

    if (searchResults && searchResults.length > 0) {
      const { lat, lon } = searchResults[0];

      // Gör reverse geocoding för att få länet (county)
      const reverseUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=6&addressdetails=1`;
      const reverseResponse = await fetch(reverseUrl);
      const reverseData = await reverseResponse.json();

      const countyName = reverseData.address?.state || null;

      // Hitta länskod genom att matcha länets namn mot counties
      let countyCode = null;
      for (const [code, data] of Object.entries(counties)) {
        if (data.name.includes(countyName)) {
          countyCode = code;
          break;
        }
      }

      return {
        coords: [parseFloat(lat), parseFloat(lon)],
        countyCode: countyCode
      };
    } else {
      console.warn('Inga koordinater hittades för stad:', city);
      return null;
    }
  } catch (error) {
    console.error('Fel vid geokodning:', error);
    return null;
  }
}