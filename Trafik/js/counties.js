// Exporterar objektet med alla län, nyckeln är länskoden. Länsnamnen finns med,
// tillsammans med koordinater till residensstaden. Det län man väljer i dropdown-menyn
// det är dennes residensstad man "hamnar i" - alltså de koordinater som finns för den staden.

export const counties = {
    '01': { name: 'Stockholms län', coords: [59.33263, 18.06761] },
    '03': { name: 'Uppsala län', coords: [59.86042, 17.64059] },
    '04': { name: 'Södermanlands län', coords: [58.75286, 17.00860] },
    '05': { name: 'Östergötlands län', coords: [58.41114, 15.62382] },
    '06': { name: 'Jönköpings län', coords: [57.78262, 14.17039] },
    '07': { name: 'Kronobergs län', coords: [56.87944, 14.80581] },
    '08': { name: 'Kalmar län', coords: [56.66353, 16.35867] },
    '09': { name: 'Gotlands län', coords: [57.63491, 18.29400] },
    '10': { name: 'Blekinge län', coords: [56.16127, 15.58569] },
    '12': { name: 'Skåne län', coords: [55.60545, 13.00567] },
    '13': { name: 'Hallands län', coords: [56.67458, 12.85664] },
    '14': { name: 'Västra götalands län', coords: [57.71114, 11.99366] },
    '17': { name: 'Värmlands län', coords: [59.40188, 13.51206] },
    '18': { name: 'Örebro län', coords: [59.27489, 15.21310] },
    '19': { name: 'Västmanlands län', coords: [59.60876, 16.54474] },
    '20': { name: 'Dalarnas län', coords: [60.60669, 15.63594] },
    '21': { name: 'Gävleborgs län', coords: [60.67479, 17.14142] },
    '22': { name: 'Västernorrlands län', coords: [62.63231, 17.94207] },
    '23': { name: 'Jämtlands län', coords: [63.17679, 14.63922] },
    '24': { name: 'Västerbottens län', coords: [63.82554, 20.26416] },
    '25': { name: 'Norrbottens län', coords: [65.58492, 22.15610] }
  };