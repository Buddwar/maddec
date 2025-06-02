# TRAFIKKARTA MED LEAFLET

Detta projekt visualiserar pågående trafikhändelser - som olyckor, hinder och vägarbeten, vägkameror samt väglag i Sverige,
med hjälp av Leaflet och Trafikverkets API:er.

# FILSTRUKTUR
- main.js: Startpunkten där alla moduler importeras och allt initialiseras.
- map-init.js: Skapar upp kartan med Leaflet och exporterar den.
- county-selector.js: Lägger till en dropdown till kartan med alla län och hämtar trafikdata för länen.
- situations.js: Hämtar och visar trafikhändelser - olyckor, hinder och vägarbeten.
- cameras.js: Hämtar och visar vägkameror - namn, vägnummer de är placerade vid samt deras riktning.
- road-conditions.js: Hämtar och visar väglagsdata via polylines, som är färgade baserat på väglaget.
- utilities.js: Hjälpfubktioner - formatering för datum, kompassriktningar, geokodning och länskodsuppslagning.
- counties.js: Lista/objekt med alla svenska län samt koordinater till varje läns residensstad.
- events.js: Hanterar klick för att öppna upp popups på kartan - för att visa mer information angående trafikhändelser, kameror   och väglag.
- map-view.css: Lägger till styling för popups samt responsiviteten på kartan.

# FUNKTIONER
--- utilities.js ---
- geocodeCity(city): En funktion som tar stadsnamn som input, sedan anropas geokodningstjänsten Nominatim (OpenStreetMap) för att hämta koordinaterna för staden där latitud och longitud returneras.
- getCountyCodeFromCoords(coords): En funktion som tar emot en stads koordinater, där vi avgör vilket län som ligger närmast det geografiska koordinatparet. Sedan returneras länskoden för det län där staden finns.
- formatDateTime: En funktion för att formatera datum och tid från ISO-format till ett mer lättläst format (YY-MM-DD-H:M)
- formatDirection: En funktion för att räkna ut riktningen som vägkamerorna pekar mot, från grader till kompassriktningar.

--- county-selector.js ---
- loadCountyFromCity(city): Tar stadsnamnet som tidningsföretagen skriver in, omvandlar det till koordinater latitud och longitud med hjälp av Nominatim (OpenStreetMap). Sedan används koordinaterna för att räkna ut vilket län de tillhör, genom att jämföra med en lista över länsgränser. Baserat på länskoden som staden tillhör, så byggs nya URL upp till API:erna för att hämta ut trafikinformation. Kartan flyttas till staden, där trafikinformation för stadens län visas.
- getUrlsForCounty(selectedCode): En funktion för att hämta URL:er till API:er, baserat på länskoden till valt län.

--- situations.js ---
- getSituations(url): Funktionen hämtar data baserat på länskoden, från API:et, trafikhändelser - som olyckor, vägarbeten och hinder. Det är endast de trafikhändelser som har "Mycket stor påverkan" och "Stor påverkan" som hämtas. Dessa visas på kartan med tillhörande ikoner som är klickbara, där en popup visas med information angående trafikhändelsen.

--- cameras.js ---
- getCameras(cameraUrl): Funktionen hämtar vägkameror från API:et baserat på länskoden. Ikoner visar vart kameran finns - och dessa ikoner är klickbara. Vid klick på en ikon öppnas en popup med information om kamerans namn, vägnummer och riktning som kameran pekar mot.

--- road-conditions.js ---
- getRoadConditions(roadConditionUrl): Funktionen hämtar ut väglagsdata från API:et baserat på länskoden. Dessa läggs till som väglagslinjer på kartan - där linjerna visar antingen grönt, gult, orange eller rött: baserat på hur väglaget är från bra - mycket dåligt.