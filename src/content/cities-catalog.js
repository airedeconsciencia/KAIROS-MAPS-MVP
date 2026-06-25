/**
 * KAIROS MAPS — Cities Catalog (Fase 3.8f.0)
 *
 * Fuente canónica única de ciudades predefinidas y códigos de país.
 * Sin DOM, sin motores, sin IA.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8f.1-f4.11-0.1';
  var EXPECTED_CITY_COUNT = 97;
  var EXPECTED_COUNTRY_COUNT = 94;

  var CITIES = [
    // Europa
    { name: 'Madrid', country: 'España', lat: 40.4168, lon: -3.7038 },
    { name: 'Barcelona', country: 'España', lat: 41.3874, lon: 2.1686 },
    { name: 'Lisboa', country: 'Portugal', lat: 38.7223, lon: -9.1393 },
    { name: 'París', country: 'Francia', lat: 48.8566, lon: 2.3522 },
    { name: 'Londres', country: 'Reino Unido', lat: 51.5074, lon: -0.1278 },
    { name: 'Roma', country: 'Italia', lat: 41.9028, lon: 12.4964 },
    { name: 'Berlín', country: 'Alemania', lat: 52.5200, lon: 13.4050 },
    { name: 'Ámsterdam', country: 'Países Bajos', lat: 52.3676, lon: 4.9041 },
    { name: 'Atenas', country: 'Grecia', lat: 37.9838, lon: 23.7275 },
    { name: 'Estocolmo', country: 'Suecia', lat: 59.3293, lon: 18.0686 },
    { name: 'Estambul', country: 'Turquía', lat: 41.0082, lon: 28.9784 },
    { name: 'Oslo', country: 'Noruega', lat: 59.9139, lon: 10.7522 },
    { name: 'Zúrich', country: 'Suiza', lat: 47.3769, lon: 8.5417 },
    { name: 'Viena', country: 'Austria', lat: 48.2082, lon: 16.3738 },
    { name: 'Bruselas', country: 'Bélgica', lat: 50.8503, lon: 4.3517 },
    { name: 'Varsovia', country: 'Polonia', lat: 52.2297, lon: 21.0122 },
    { name: 'Praga', country: 'República Checa', lat: 50.0755, lon: 14.4378 },
    { name: 'Copenhague', country: 'Dinamarca', lat: 55.6761, lon: 12.5683 },
    { name: 'Helsinki', country: 'Finlandia', lat: 60.1699, lon: 24.9384 },
    { name: 'Dublín', country: 'Irlanda', lat: 53.3498, lon: -6.2603 },
    { name: 'Zagreb', country: 'Croacia', lat: 45.8150, lon: 15.9819 },
    { name: 'Budapest', country: 'Hungría', lat: 47.4979, lon: 19.0402 },
    // América
    { name: 'Nueva York', country: 'EE. UU.', lat: 40.7128, lon: -74.0060 },
    { name: 'Los Ángeles', country: 'EE. UU.', lat: 34.0522, lon: -118.2437 },
    { name: 'Toronto', country: 'Canadá', lat: 43.6532, lon: -79.3832 },
    { name: 'Ciudad de México', country: 'México', lat: 19.4326, lon: -99.1332 },
    { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816 },
    { name: 'Río de Janeiro', country: 'Brasil', lat: -22.9068, lon: -43.1729 },
    { name: 'Lima', country: 'Perú', lat: -12.0464, lon: -77.0428 },
    { name: 'Bogotá', country: 'Colombia', lat: 4.7110, lon: -74.0721 },
    { name: 'Santiago', country: 'Chile', lat: -33.4489, lon: -70.6693 },
    { name: 'Montevideo', country: 'Uruguay', lat: -34.9011, lon: -56.1645 },
    { name: 'Quito', country: 'Ecuador', lat: -0.1807, lon: -78.4678 },
    { name: 'San José', country: 'Costa Rica', lat: 9.9281, lon: -84.0907 },
    { name: 'Ciudad de Panamá', country: 'Panamá', lat: 8.9824, lon: -79.5199 },
    { name: 'Asunción', country: 'Paraguay', lat: -25.2637, lon: -57.5759 },
    { name: 'La Paz', country: 'Bolivia', lat: -16.4897, lon: -68.1193 },
    { name: 'Kingston', country: 'Jamaica', lat: 17.9714, lon: -76.7926 },
    { name: 'Port of Spain', country: 'Trinidad y Tobago', lat: 10.6596, lon: -61.5089 },
    { name: 'Bridgetown', country: 'Barbados', lat: 13.0975, lon: -59.6167 },
    // Asia
    { name: 'Tokio', country: 'Japón', lat: 35.6762, lon: 139.6503 },
    { name: 'Seúl', country: 'Corea del Sur', lat: 37.5665, lon: 126.9780 },
    { name: 'Shanghái', country: 'China', lat: 31.2304, lon: 121.4737 },
    { name: 'Taipéi', country: 'Taiwán', lat: 25.0330, lon: 121.5654 },
    { name: 'Bangkok', country: 'Tailandia', lat: 13.7563, lon: 100.5018 },
    { name: 'Singapur', country: 'Singapur', lat: 1.3521, lon: 103.8198 },
    { name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lon: 106.6297 },
    { name: 'Kuala Lumpur', country: 'Malasia', lat: 3.1390, lon: 101.6869 },
    { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lon: 106.8456 },
    { name: 'Manila', country: 'Filipinas', lat: 14.5995, lon: 120.9842 },
    { name: 'Phnom Penh', country: 'Camboya', lat: 11.5564, lon: 104.9282 },
    { name: 'Vientián', country: 'Laos', lat: 17.9757, lon: 102.6331 },
    { name: 'Yangón', country: 'Myanmar', lat: 16.8661, lon: 96.1951 },
    { name: 'Bandar Seri Begawan', country: 'Brunéi', lat: 4.9031, lon: 114.9398 },
    { name: 'Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
    { name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777 },
    { name: 'Karachi', country: 'Pakistán', lat: 24.8607, lon: 67.0011 },
    { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lon: 90.4125 },
    { name: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lon: 79.8612 },
    { name: 'Kathmandu', country: 'Nepal', lat: 27.7172, lon: 85.3240 },
    { name: 'Thimphu', country: 'Bután', lat: 27.4712, lon: 89.6339 },
    { name: 'Malé', country: 'Maldivas', lat: 4.1755, lon: 73.5093 },
    { name: 'Kabul', country: 'Afganistán', lat: 34.5553, lon: 69.2075 },
    // África
    { name: 'Casablanca', country: 'Marruecos', lat: 33.5731, lon: -7.5898 },
    { name: 'Túnez', country: 'Túnez', lat: 36.8065, lon: 10.1815 },
    { name: 'Ciudad del Cabo', country: 'Sudáfrica', lat: -33.9249, lon: 18.4241 },
    { name: 'El Cairo', country: 'Egipto', lat: 30.0444, lon: 31.2357 },
    { name: 'Dubái', country: 'Emiratos Árabes Unidos', lat: 25.2048, lon: 55.2708 },
    { name: 'Doha', country: 'Catar', lat: 25.2854, lon: 51.5310 },
    { name: 'Riad', country: 'Arabia Saudí', lat: 24.7136, lon: 46.6753 },
    { name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lon: 34.7818 },
    { name: 'Amán', country: 'Jordania', lat: 31.9454, lon: 35.9284 },
    { name: 'Nairobi', country: 'Kenia', lat: -1.2921, lon: 36.8219 },
    { name: 'Addis Abeba', country: 'Etiopía', lat: 9.0320, lon: 38.7469 },
    { name: 'Dar es Salaam', country: 'Tanzania', lat: -6.7924, lon: 39.2083 },
    { name: 'Kampala', country: 'Uganda', lat: 0.3476, lon: 32.5825 },
    { name: 'Kigali', country: 'Ruanda', lat: -1.9403, lon: 29.8739 },
    { name: 'Luanda', country: 'Angola', lat: -8.8390, lon: 13.2894 },
    { name: 'Maputo', country: 'Mozambique', lat: -25.9692, lon: 32.5732 },
    { name: 'Antananarivo', country: 'Madagascar', lat: -18.8792, lon: 47.5079 },
    { name: 'Port Louis', country: 'Mauricio', lat: -20.1609, lon: 57.5012 },
    { name: 'Windhoek', country: 'Namibia', lat: -22.5609, lon: 17.0658 },
    { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lon: 3.3792 },
    { name: 'Accra', country: 'Ghana', lat: 5.6037, lon: -0.1870 },
    { name: 'Dakar', country: 'Senegal', lat: 14.7167, lon: -17.4677 },
    { name: 'Abidjan', country: 'Costa de Marfil', lat: 5.3600, lon: -4.0083 },
    { name: 'Freetown', country: 'Sierra Leona', lat: 8.4657, lon: -13.2317 },
    { name: 'Monrovia', country: 'Liberia', lat: 6.3156, lon: -10.8074 },
    { name: 'Conakry', country: 'Guinea', lat: 9.6412, lon: -13.5784 },
    { name: 'Cotonou', country: 'Benín', lat: 6.3703, lon: 2.3912 },
    { name: 'Lomé', country: 'Togo', lat: 6.1256, lon: 1.2254 },
    { name: 'Banjul', country: 'Gambia', lat: 13.4549, lon: -16.5790 },
    { name: 'Bamako', country: 'Mali', lat: 12.6392, lon: -8.0029 },
    { name: 'Uagadugú', country: 'Burkina Faso', lat: 12.3714, lon: -1.5197 },
    { name: 'Niamey', country: 'Níger', lat: 13.5127, lon: 2.1128 },
    // Oceanía
    { name: 'Sídney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
    { name: 'Auckland', country: 'Nueva Zelanda', lat: -36.8485, lon: 174.7633 }
  ];

  var COUNTRY_CODES = {
    'España': 'es',
    'Portugal': 'pt',
    'Francia': 'fr',
    'Reino Unido': 'uk',
    'Italia': 'it',
    'Alemania': 'de',
    'Países Bajos': 'nl',
    'Grecia': 'gr',
    'Suecia': 'se',
    'Turquía': 'tr',
    'Noruega': 'no',
    'Suiza': 'ch',
    'Austria': 'at',
    'Bélgica': 'be',
    'Polonia': 'pl',
    'República Checa': 'cz',
    'Dinamarca': 'dk',
    'Finlandia': 'fi',
    'Irlanda': 'ie',
    'Croacia': 'hr',
    'Hungría': 'hu',
    'Marruecos': 'ma',
    'Túnez': 'tn',
    'EE. UU.': 'us',
    'Canadá': 'ca',
    'México': 'mx',
    'Argentina': 'ar',
    'Brasil': 'br',
    'Perú': 'pe',
    'Colombia': 'co',
    'Chile': 'cl',
    'Uruguay': 'uy',
    'Ecuador': 'ec',
    'Costa Rica': 'cr',
    'Panamá': 'pa',
    'Paraguay': 'py',
    'Bolivia': 'bo',
    'Jamaica': 'jm',
    'Trinidad y Tobago': 'tt',
    'Barbados': 'bb',
    'Japón': 'jp',
    'Corea del Sur': 'kr',
    'China': 'cn',
    'Taiwán': 'tw',
    'Tailandia': 'th',
    'Singapur': 'sg',
    'Vietnam': 'vn',
    'Malasia': 'my',
    'Indonesia': 'id',
    'Filipinas': 'ph',
    'Camboya': 'kh',
    'Laos': 'la',
    'Myanmar': 'mm',
    'Brunéi': 'bn',
    'India': 'in',
    'Pakistán': 'pk',
    'Bangladesh': 'bd',
    'Sri Lanka': 'lk',
    'Nepal': 'np',
    'Bután': 'bt',
    'Maldivas': 'mv',
    'Afganistán': 'af',
    'Sudáfrica': 'za',
    'Egipto': 'eg',
    'Emiratos Árabes Unidos': 'ae',
    'Catar': 'qa',
    'Arabia Saudí': 'sa',
    'Israel': 'il',
    'Jordania': 'jo',
    'Kenia': 'ke',
    'Etiopía': 'et',
    'Tanzania': 'tz',
    'Uganda': 'ug',
    'Ruanda': 'rw',
    'Angola': 'ao',
    'Mozambique': 'mz',
    'Madagascar': 'mg',
    'Mauricio': 'mu',
    'Namibia': 'na',
    'Nigeria': 'ng',
    'Ghana': 'gh',
    'Senegal': 'sn',
    'Costa de Marfil': 'ci',
    'Sierra Leona': 'sl',
    'Liberia': 'lr',
    'Guinea': 'gn',
    'Benín': 'bj',
    'Togo': 'tg',
    'Gambia': 'gm',
    'Mali': 'ml',
    'Burkina Faso': 'bf',
    'Níger': 'ne',
    'Australia': 'au',
    'Nueva Zelanda': 'nz'
  };

  /** Slugs estables para futura Country Archetype Layer (3.8f.2+) */
  var COUNTRY_IDS = {
    'España': 'spain',
    'Portugal': 'portugal',
    'Francia': 'france',
    'Reino Unido': 'united_kingdom',
    'Italia': 'italy',
    'Alemania': 'germany',
    'Países Bajos': 'netherlands',
    'Grecia': 'greece',
    'Suecia': 'sweden',
    'Turquía': 'turkey',
    'Noruega': 'norway',
    'Suiza': 'switzerland',
    'Austria': 'austria',
    'Bélgica': 'belgium',
    'Polonia': 'poland',
    'República Checa': 'czech_republic',
    'Dinamarca': 'denmark',
    'Finlandia': 'finland',
    'Irlanda': 'ireland',
    'Croacia': 'croatia',
    'Hungría': 'hungary',
    'Marruecos': 'morocco',
    'Túnez': 'tunisia',
    'EE. UU.': 'united_states',
    'Canadá': 'canada',
    'México': 'mexico',
    'Argentina': 'argentina',
    'Brasil': 'brazil',
    'Perú': 'peru',
    'Colombia': 'colombia',
    'Chile': 'chile',
    'Uruguay': 'uruguay',
    'Ecuador': 'ecuador',
    'Costa Rica': 'costa_rica',
    'Panamá': 'panama',
    'Paraguay': 'paraguay',
    'Bolivia': 'bolivia',
    'Jamaica': 'jamaica',
    'Trinidad y Tobago': 'trinidad_and_tobago',
    'Barbados': 'barbados',
    'Japón': 'japan',
    'Corea del Sur': 'south_korea',
    'China': 'china',
    'Taiwán': 'taiwan',
    'Tailandia': 'thailand',
    'Singapur': 'singapore',
    'Vietnam': 'vietnam',
    'Malasia': 'malaysia',
    'Indonesia': 'indonesia',
    'Filipinas': 'philippines',
    'Camboya': 'cambodia',
    'Laos': 'laos',
    'Myanmar': 'myanmar',
    'Brunéi': 'brunei',
    'India': 'india',
    'Pakistán': 'pakistan',
    'Bangladesh': 'bangladesh',
    'Sri Lanka': 'sri_lanka',
    'Nepal': 'nepal',
    'Bután': 'bhutan',
    'Maldivas': 'maldives',
    'Afganistán': 'afghanistan',
    'Sudáfrica': 'south_africa',
    'Egipto': 'egypt',
    'Emiratos Árabes Unidos': 'united_arab_emirates',
    'Catar': 'qatar',
    'Arabia Saudí': 'saudi_arabia',
    'Israel': 'israel',
    'Jordania': 'jordan',
    'Kenia': 'kenya',
    'Etiopía': 'ethiopia',
    'Tanzania': 'tanzania',
    'Uganda': 'uganda',
    'Ruanda': 'rwanda',
    'Angola': 'angola',
    'Mozambique': 'mozambique',
    'Madagascar': 'madagascar',
    'Mauricio': 'mauritius',
    'Namibia': 'namibia',
    'Nigeria': 'nigeria',
    'Ghana': 'ghana',
    'Senegal': 'senegal',
    'Costa de Marfil': 'ivory_coast',
    'Sierra Leona': 'sierra_leone',
    'Liberia': 'liberia',
    'Guinea': 'guinea',
    'Benín': 'benin',
    'Togo': 'togo',
    'Gambia': 'gambia',
    'Mali': 'mali',
    'Burkina Faso': 'burkina_faso',
    'Níger': 'niger',
    'Australia': 'australia',
    'Nueva Zelanda': 'new_zealand'
  };

  var LAB_CITY_NAMES = ['Lisboa', 'Toronto', 'Ciudad del Cabo'];

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function resolveCountryCode(country) {
    return COUNTRY_CODES[country] || slugify(country).slice(0, 2) || 'xx';
  }

  function resolveCountryId(country) {
    return COUNTRY_IDS[country] || slugify(country).replace(/-/g, '_') || null;
  }

  function cityIdFromRef(city) {
    var cc = resolveCountryCode(city && city.country);
    return slugify(city && city.name) + '-' + cc;
  }

  function findCityByName(name) {
    return CITIES.find(function (c) { return c.name === name; }) || null;
  }

  function getLabCities() {
    return LAB_CITY_NAMES.map(function (name) {
      var city = findCityByName(name);
      if (!city) throw new Error('Lab city not found in catalog: ' + name);
      return city;
    });
  }

  function getCountries() {
    var seen = {};
    var out = [];
    CITIES.forEach(function (city) {
      if (!city.country || seen[city.country]) return;
      seen[city.country] = true;
      out.push({
        name: city.country,
        code: resolveCountryCode(city.country),
        countryId: resolveCountryId(city.country)
      });
    });
    return out;
  }

  function validateCatalog() {
    var issues = [];
    if (CITIES.length !== EXPECTED_CITY_COUNT) {
      issues.push('city count ' + CITIES.length + ' !== ' + EXPECTED_CITY_COUNT);
    }
    var countries = getCountries();
    if (countries.length !== EXPECTED_COUNTRY_COUNT) {
      issues.push('country count ' + countries.length + ' !== ' + EXPECTED_COUNTRY_COUNT);
    }
    var ids = {};
    CITIES.forEach(function (city) {
      var id = cityIdFromRef(city);
      if (ids[id]) issues.push('duplicate cityId: ' + id);
      ids[id] = true;
      if (!COUNTRY_CODES[city.country]) {
        issues.push('missing COUNTRY_CODES for: ' + city.country);
      }
      if (!COUNTRY_IDS[city.country]) {
        issues.push('missing COUNTRY_IDS for: ' + city.country);
      }
    });
    return { ok: issues.length === 0, issues: issues };
  }

  window.KairosCitiesCatalog = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    EXPECTED_CITY_COUNT: EXPECTED_CITY_COUNT,
    EXPECTED_COUNTRY_COUNT: EXPECTED_COUNTRY_COUNT,
    CITIES: CITIES,
    COUNTRY_CODES: COUNTRY_CODES,
    COUNTRY_IDS: COUNTRY_IDS,
    LAB_CITY_NAMES: LAB_CITY_NAMES,
    slugify: slugify,
    resolveCountryCode: resolveCountryCode,
    resolveCountryId: resolveCountryId,
    cityIdFromRef: cityIdFromRef,
    findCityByName: findCityByName,
    getLabCities: getLabCities,
    getCountries: getCountries,
    validateCatalog: validateCatalog
  };
})();
