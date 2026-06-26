/**
 * KAIROS MAPS — City Identity Index (Fase 7.5e mapping)
 *
 * 106 ciudades → 28 arquetipos · solo metadatos.
 * Sin modulación · sin dimensiones por ciudad.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '7.5e-0.1';
  var EXPECTED_CITY_COUNT = 106;

  var CITY_IDENTITY_INDEX = {
    "madrid-es": {
      "citySlug": "madrid-es",
      "countryId": "spain",
      "catalogName": "Madrid",
      "identityArchetype": "layered_capital",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "barcelona-es": {
      "citySlug": "barcelona-es",
      "countryId": "spain",
      "catalogName": "Barcelona",
      "identityArchetype": "creative_expansion",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "lisboa-pt": {
      "citySlug": "lisboa-pt",
      "countryId": "portugal",
      "catalogName": "Lisboa",
      "identityArchetype": "quiet_integration",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "paris-fr": {
      "citySlug": "paris-fr",
      "countryId": "france",
      "catalogName": "París",
      "identityArchetype": "projection",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "londres-uk": {
      "citySlug": "londres-uk",
      "countryId": "united_kingdom",
      "catalogName": "Londres",
      "identityArchetype": "cosmopolitan_collage",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "roma-it": {
      "citySlug": "roma-it",
      "countryId": "italy",
      "catalogName": "Roma",
      "identityArchetype": "cultural_memory",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "berlin-de": {
      "citySlug": "berlin-de",
      "countryId": "germany",
      "catalogName": "Berlín",
      "identityArchetype": "adaptive_reinvention",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "amsterdam-nl": {
      "citySlug": "amsterdam-nl",
      "countryId": "netherlands",
      "catalogName": "Ámsterdam",
      "identityArchetype": "spontaneous_exchange",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "atenas-gr": {
      "citySlug": "atenas-gr",
      "countryId": "greece",
      "catalogName": "Atenas",
      "identityArchetype": "cultural_memory",
      "confidence": "A",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "estocolmo-se": {
      "citySlug": "estocolmo-se",
      "countryId": "sweden",
      "catalogName": "Estocolmo",
      "identityArchetype": "disciplined_precision",
      "confidence": "A",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "estambul-tr": {
      "citySlug": "estambul-tr",
      "countryId": "turkey",
      "catalogName": "Estambul",
      "identityArchetype": "border_threshold",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "oslo-no": {
      "citySlug": "oslo-no",
      "countryId": "norway",
      "catalogName": "Oslo",
      "identityArchetype": "sovereign_calm",
      "confidence": "A",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "zurich-ch": {
      "citySlug": "zurich-ch",
      "countryId": "switzerland",
      "catalogName": "Zúrich",
      "identityArchetype": "disciplined_precision",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "viena-at": {
      "citySlug": "viena-at",
      "countryId": "austria",
      "catalogName": "Viena",
      "identityArchetype": "cultural_memory",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "bruselas-be": {
      "citySlug": "bruselas-be",
      "countryId": "belgium",
      "catalogName": "Bruselas",
      "identityArchetype": "institutional_visibility",
      "confidence": "A",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "varsovia-pl": {
      "citySlug": "varsovia-pl",
      "countryId": "poland",
      "catalogName": "Varsovia",
      "identityArchetype": "adaptive_reinvention",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "praga-cz": {
      "citySlug": "praga-cz",
      "countryId": "czech_republic",
      "catalogName": "Praga",
      "identityArchetype": "cultural_memory",
      "confidence": "A",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "copenhague-dk": {
      "citySlug": "copenhague-dk",
      "countryId": "denmark",
      "catalogName": "Copenhague",
      "identityArchetype": "coastal_balance",
      "confidence": "A",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "helsinki-fi": {
      "citySlug": "helsinki-fi",
      "countryId": "finland",
      "catalogName": "Helsinki",
      "identityArchetype": "sovereign_calm",
      "confidence": "A",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "dublin-ie": {
      "citySlug": "dublin-ie",
      "countryId": "ireland",
      "catalogName": "Dublín",
      "identityArchetype": "spontaneous_exchange",
      "confidence": "A",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "zagreb-hr": {
      "citySlug": "zagreb-hr",
      "countryId": "croatia",
      "catalogName": "Zagreb",
      "identityArchetype": "border_threshold",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "budapest-hu": {
      "citySlug": "budapest-hu",
      "countryId": "hungary",
      "catalogName": "Budapest",
      "identityArchetype": "cultural_memory",
      "confidence": "A",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "nueva-york-us": {
      "citySlug": "nueva-york-us",
      "countryId": "united_states",
      "catalogName": "Nueva York",
      "identityArchetype": "layered_capital",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "los-angeles-us": {
      "citySlug": "los-angeles-us",
      "countryId": "united_states",
      "catalogName": "Los Ángeles",
      "identityArchetype": "projection",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "toronto-ca": {
      "citySlug": "toronto-ca",
      "countryId": "canada",
      "catalogName": "Toronto",
      "identityArchetype": "cosmopolitan_collage",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "ciudad-de-mexico-mx": {
      "citySlug": "ciudad-de-mexico-mx",
      "countryId": "mexico",
      "catalogName": "Ciudad de México",
      "identityArchetype": "layered_capital",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "buenos-aires-ar": {
      "citySlug": "buenos-aires-ar",
      "countryId": "argentina",
      "catalogName": "Buenos Aires",
      "identityArchetype": "expressive_intensity",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "rio-de-janeiro-br": {
      "citySlug": "rio-de-janeiro-br",
      "countryId": "brazil",
      "catalogName": "Río de Janeiro",
      "identityArchetype": "coastal_balance",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "lima-pe": {
      "citySlug": "lima-pe",
      "countryId": "peru",
      "catalogName": "Lima",
      "identityArchetype": "coastal_balance",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "bogota-co": {
      "citySlug": "bogota-co",
      "countryId": "colombia",
      "catalogName": "Bogotá",
      "identityArchetype": "layered_capital",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "santiago-cl": {
      "citySlug": "santiago-cl",
      "countryId": "chile",
      "catalogName": "Santiago",
      "identityArchetype": "structural_ambition",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "montevideo-uy": {
      "citySlug": "montevideo-uy",
      "countryId": "uruguay",
      "catalogName": "Montevideo",
      "identityArchetype": "quiet_integration",
      "confidence": "A",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "quito-ec": {
      "citySlug": "quito-ec",
      "countryId": "ecuador",
      "catalogName": "Quito",
      "identityArchetype": "expansive_horizon",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "san-jose-cr": {
      "citySlug": "san-jose-cr",
      "countryId": "costa_rica",
      "catalogName": "San José",
      "identityArchetype": "quiet_integration",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "ciudad-de-panama-pa": {
      "citySlug": "ciudad-de-panama-pa",
      "countryId": "panama",
      "catalogName": "Ciudad de Panamá",
      "identityArchetype": "trade_crossroads",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "asuncion-py": {
      "citySlug": "asuncion-py",
      "countryId": "paraguay",
      "catalogName": "Asunción",
      "identityArchetype": "quiet_integration",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "la-paz-bo": {
      "citySlug": "la-paz-bo",
      "countryId": "bolivia",
      "catalogName": "La Paz",
      "identityArchetype": "expansive_horizon",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "kingston-jm": {
      "citySlug": "kingston-jm",
      "countryId": "jamaica",
      "catalogName": "Kingston",
      "identityArchetype": "spontaneous_exchange",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "port-of-spain-tt": {
      "citySlug": "port-of-spain-tt",
      "countryId": "trinidad_and_tobago",
      "catalogName": "Port of Spain",
      "identityArchetype": "trade_crossroads",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "bridgetown-bb": {
      "citySlug": "bridgetown-bb",
      "countryId": "barbados",
      "catalogName": "Bridgetown",
      "identityArchetype": "island_retreat",
      "confidence": "M",
      "status": "approved",
      "densityTier": "standard",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "nassau-bs": {
      "citySlug": "nassau-bs",
      "countryId": "bahamas",
      "catalogName": "Nassau",
      "identityArchetype": "island_retreat",
      "confidence": "M",
      "status": "approved",
      "densityTier": "standard",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "belmopan-bz": {
      "citySlug": "belmopan-bz",
      "countryId": "belize",
      "catalogName": "Belmopán",
      "identityArchetype": "frontier_emergence",
      "confidence": "B",
      "status": "review_required",
      "densityTier": "emerging",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "georgetown-gy": {
      "citySlug": "georgetown-gy",
      "countryId": "guyana",
      "catalogName": "Georgetown",
      "identityArchetype": "border_threshold",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "paramaribo-sr": {
      "citySlug": "paramaribo-sr",
      "countryId": "suriname",
      "catalogName": "Paramaribo",
      "identityArchetype": "border_threshold",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "tokio-jp": {
      "citySlug": "tokio-jp",
      "countryId": "japan",
      "catalogName": "Tokio",
      "identityArchetype": "technological_acceleration",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "seul-kr": {
      "citySlug": "seul-kr",
      "countryId": "south_korea",
      "catalogName": "Seúl",
      "identityArchetype": "technological_acceleration",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "shanghai-cn": {
      "citySlug": "shanghai-cn",
      "countryId": "china",
      "catalogName": "Shanghái",
      "identityArchetype": "layered_capital",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "taipei-tw": {
      "citySlug": "taipei-tw",
      "countryId": "taiwan",
      "catalogName": "Taipéi",
      "identityArchetype": "networked_momentum",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "ulan-bator-mn": {
      "citySlug": "ulan-bator-mn",
      "countryId": "mongolia",
      "catalogName": "Ulán Bator",
      "identityArchetype": "expansive_horizon",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "bangkok-th": {
      "citySlug": "bangkok-th",
      "countryId": "thailand",
      "catalogName": "Bangkok",
      "identityArchetype": "spontaneous_exchange",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "singapur-sg": {
      "citySlug": "singapur-sg",
      "countryId": "singapore",
      "catalogName": "Singapur",
      "identityArchetype": "trade_crossroads",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "ho-chi-minh-city-vn": {
      "citySlug": "ho-chi-minh-city-vn",
      "countryId": "vietnam",
      "catalogName": "Ho Chi Minh City",
      "identityArchetype": "adaptive_reinvention",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "kuala-lumpur-my": {
      "citySlug": "kuala-lumpur-my",
      "countryId": "malaysia",
      "catalogName": "Kuala Lumpur",
      "identityArchetype": "trade_crossroads",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "jakarta-id": {
      "citySlug": "jakarta-id",
      "countryId": "indonesia",
      "catalogName": "Jakarta",
      "identityArchetype": "networked_momentum",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "manila-ph": {
      "citySlug": "manila-ph",
      "countryId": "philippines",
      "catalogName": "Manila",
      "identityArchetype": "resilient_ordinariness",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "phnom-penh-kh": {
      "citySlug": "phnom-penh-kh",
      "countryId": "cambodia",
      "catalogName": "Phnom Penh",
      "identityArchetype": "contemplative_depth",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "vientian-la": {
      "citySlug": "vientian-la",
      "countryId": "laos",
      "catalogName": "Vientián",
      "identityArchetype": "meditative_withdrawal",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "yangon-mm": {
      "citySlug": "yangon-mm",
      "countryId": "myanmar",
      "catalogName": "Yangón",
      "identityArchetype": "contemplative_depth",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "bandar-seri-begawan-bn": {
      "citySlug": "bandar-seri-begawan-bn",
      "countryId": "brunei",
      "catalogName": "Bandar Seri Begawan",
      "identityArchetype": "sovereign_calm",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "dili-tl": {
      "citySlug": "dili-tl",
      "countryId": "timor_leste",
      "catalogName": "Dili",
      "identityArchetype": "frontier_emergence",
      "confidence": "M",
      "status": "approved",
      "densityTier": "emerging",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "delhi-in": {
      "citySlug": "delhi-in",
      "countryId": "india",
      "catalogName": "Delhi",
      "identityArchetype": "layered_capital",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "mumbai-in": {
      "citySlug": "mumbai-in",
      "countryId": "india",
      "catalogName": "Mumbai",
      "identityArchetype": "networked_momentum",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "karachi-pk": {
      "citySlug": "karachi-pk",
      "countryId": "pakistan",
      "catalogName": "Karachi",
      "identityArchetype": "trade_crossroads",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "dhaka-bd": {
      "citySlug": "dhaka-bd",
      "countryId": "bangladesh",
      "catalogName": "Dhaka",
      "identityArchetype": "resilient_ordinariness",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "colombo-lk": {
      "citySlug": "colombo-lk",
      "countryId": "sri_lanka",
      "catalogName": "Colombo",
      "identityArchetype": "coastal_balance",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "kathmandu-np": {
      "citySlug": "kathmandu-np",
      "countryId": "nepal",
      "catalogName": "Kathmandu",
      "identityArchetype": "meditative_withdrawal",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "thimphu-bt": {
      "citySlug": "thimphu-bt",
      "countryId": "bhutan",
      "catalogName": "Thimphu",
      "identityArchetype": "meditative_withdrawal",
      "confidence": "A",
      "status": "approved",
      "densityTier": "standard",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "male-mv": {
      "citySlug": "male-mv",
      "countryId": "maldives",
      "catalogName": "Malé",
      "identityArchetype": "island_retreat",
      "confidence": "A",
      "status": "approved",
      "densityTier": "standard",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "kabul-af": {
      "citySlug": "kabul-af",
      "countryId": "afghanistan",
      "catalogName": "Kabul",
      "identityArchetype": "contained_intensity",
      "confidence": "B",
      "status": "review_required",
      "densityTier": "emerging",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "casablanca-ma": {
      "citySlug": "casablanca-ma",
      "countryId": "morocco",
      "catalogName": "Casablanca",
      "identityArchetype": "trade_crossroads",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "tunez-tn": {
      "citySlug": "tunez-tn",
      "countryId": "tunisia",
      "catalogName": "Túnez",
      "identityArchetype": "coastal_balance",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "ciudad-del-cabo-za": {
      "citySlug": "ciudad-del-cabo-za",
      "countryId": "south_africa",
      "catalogName": "Ciudad del Cabo",
      "identityArchetype": "expansive_horizon",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "el-cairo-eg": {
      "citySlug": "el-cairo-eg",
      "countryId": "egypt",
      "catalogName": "El Cairo",
      "identityArchetype": "cultural_memory",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "dubai-ae": {
      "citySlug": "dubai-ae",
      "countryId": "united_arab_emirates",
      "catalogName": "Dubái",
      "identityArchetype": "projection",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "doha-qa": {
      "citySlug": "doha-qa",
      "countryId": "qatar",
      "catalogName": "Doha",
      "identityArchetype": "sovereign_calm",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "riad-sa": {
      "citySlug": "riad-sa",
      "countryId": "saudi_arabia",
      "catalogName": "Riad",
      "identityArchetype": "sovereign_calm",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "tel-aviv-il": {
      "citySlug": "tel-aviv-il",
      "countryId": "israel",
      "catalogName": "Tel Aviv",
      "identityArchetype": "technological_acceleration",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "aman-jo": {
      "citySlug": "aman-jo",
      "countryId": "jordan",
      "catalogName": "Amán",
      "identityArchetype": "border_threshold",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "beirut-lb": {
      "citySlug": "beirut-lb",
      "countryId": "lebanon",
      "catalogName": "Beirut",
      "identityArchetype": "border_threshold",
      "confidence": "B",
      "status": "review_required",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "ciudad-de-kuwait-kw": {
      "citySlug": "ciudad-de-kuwait-kw",
      "countryId": "kuwait",
      "catalogName": "Ciudad de Kuwait",
      "identityArchetype": "trade_crossroads",
      "confidence": "M",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "mascate-om": {
      "citySlug": "mascate-om",
      "countryId": "oman",
      "catalogName": "Mascate",
      "identityArchetype": "sovereign_calm",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "nairobi-ke": {
      "citySlug": "nairobi-ke",
      "countryId": "kenya",
      "catalogName": "Nairobi",
      "identityArchetype": "networked_momentum",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "addis-abeba-et": {
      "citySlug": "addis-abeba-et",
      "countryId": "ethiopia",
      "catalogName": "Addis Abeba",
      "identityArchetype": "frontier_emergence",
      "confidence": "B",
      "status": "review_required",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "dar-es-salaam-tz": {
      "citySlug": "dar-es-salaam-tz",
      "countryId": "tanzania",
      "catalogName": "Dar es Salaam",
      "identityArchetype": "coastal_balance",
      "confidence": "M",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "kampala-ug": {
      "citySlug": "kampala-ug",
      "countryId": "uganda",
      "catalogName": "Kampala",
      "identityArchetype": "resilient_ordinariness",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "kigali-rw": {
      "citySlug": "kigali-rw",
      "countryId": "rwanda",
      "catalogName": "Kigali",
      "identityArchetype": "regenerative_slow_burn",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "luanda-ao": {
      "citySlug": "luanda-ao",
      "countryId": "angola",
      "catalogName": "Luanda",
      "identityArchetype": "frontier_emergence",
      "confidence": "M",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "maputo-mz": {
      "citySlug": "maputo-mz",
      "countryId": "mozambique",
      "catalogName": "Maputo",
      "identityArchetype": "coastal_balance",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "antananarivo-mg": {
      "citySlug": "antananarivo-mg",
      "countryId": "madagascar",
      "catalogName": "Antananarivo",
      "identityArchetype": "island_retreat",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "port-louis-mu": {
      "citySlug": "port-louis-mu",
      "countryId": "mauritius",
      "catalogName": "Port Louis",
      "identityArchetype": "island_retreat",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "windhoek-na": {
      "citySlug": "windhoek-na",
      "countryId": "namibia",
      "catalogName": "Windhoek",
      "identityArchetype": "expansive_horizon",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "lagos-ng": {
      "citySlug": "lagos-ng",
      "countryId": "nigeria",
      "catalogName": "Lagos",
      "identityArchetype": "networked_momentum",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "accra-gh": {
      "citySlug": "accra-gh",
      "countryId": "ghana",
      "catalogName": "Accra",
      "identityArchetype": "spontaneous_exchange",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "dakar-sn": {
      "citySlug": "dakar-sn",
      "countryId": "senegal",
      "catalogName": "Dakar",
      "identityArchetype": "coastal_balance",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "abidjan-ci": {
      "citySlug": "abidjan-ci",
      "countryId": "ivory_coast",
      "catalogName": "Abidjan",
      "identityArchetype": "trade_crossroads",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "freetown-sl": {
      "citySlug": "freetown-sl",
      "countryId": "sierra_leone",
      "catalogName": "Freetown",
      "identityArchetype": "resilient_ordinariness",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "monrovia-lr": {
      "citySlug": "monrovia-lr",
      "countryId": "liberia",
      "catalogName": "Monrovia",
      "identityArchetype": "resilient_ordinariness",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "conakry-gn": {
      "citySlug": "conakry-gn",
      "countryId": "guinea",
      "catalogName": "Conakry",
      "identityArchetype": "resilient_ordinariness",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "cotonou-bj": {
      "citySlug": "cotonou-bj",
      "countryId": "benin",
      "catalogName": "Cotonou",
      "identityArchetype": "trade_crossroads",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "lome-tg": {
      "citySlug": "lome-tg",
      "countryId": "togo",
      "catalogName": "Lomé",
      "identityArchetype": "resilient_ordinariness",
      "confidence": "B",
      "status": "review_required",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "banjul-gm": {
      "citySlug": "banjul-gm",
      "countryId": "gambia",
      "catalogName": "Banjul",
      "identityArchetype": "quiet_integration",
      "confidence": "B",
      "status": "review_required",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "bamako-ml": {
      "citySlug": "bamako-ml",
      "countryId": "mali",
      "catalogName": "Bamako",
      "identityArchetype": "resilient_ordinariness",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "uagadugu-bf": {
      "citySlug": "uagadugu-bf",
      "countryId": "burkina_faso",
      "catalogName": "Uagadugú",
      "identityArchetype": "resilient_ordinariness",
      "confidence": "M",
      "status": "approved",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "niamey-ne": {
      "citySlug": "niamey-ne",
      "countryId": "niger",
      "catalogName": "Niamey",
      "identityArchetype": "frontier_emergence",
      "confidence": "B",
      "status": "review_required",
      "densityTier": "capital",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "sidney-au": {
      "citySlug": "sidney-au",
      "countryId": "australia",
      "catalogName": "Sídney",
      "identityArchetype": "coastal_balance",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    },
    "auckland-nz": {
      "citySlug": "auckland-nz",
      "countryId": "new_zealand",
      "catalogName": "Auckland",
      "identityArchetype": "quiet_integration",
      "confidence": "A",
      "status": "approved",
      "densityTier": "hub",
      "source": "f7.3a_provisional",
      "notes": ""
    }
  };

  function getCityIdentity(citySlug) {
    if (!citySlug) return null;
    return CITY_IDENTITY_INDEX[String(citySlug).trim()] || null;
  }

  function hasCityIdentity(citySlug) {
    if (!citySlug) return false;
    return Object.prototype.hasOwnProperty.call(CITY_IDENTITY_INDEX, String(citySlug).trim());
  }

  function listCityIdentities() {
    return Object.keys(CITY_IDENTITY_INDEX).map(function (slug) {
      return CITY_IDENTITY_INDEX[slug];
    });
  }

  function getIdentityCoverage() {
    var total = Object.keys(CITY_IDENTITY_INDEX).length;
    var byConfidence = { A: 0, M: 0, B: 0 };
    var byArchetype = {};
    var reviewRequired = 0;
    Object.keys(CITY_IDENTITY_INDEX).forEach(function (slug) {
      var entry = CITY_IDENTITY_INDEX[slug];
      if (entry.confidence && byConfidence[entry.confidence] != null) {
        byConfidence[entry.confidence] += 1;
      }
      if (entry.status === 'review_required') reviewRequired += 1;
      byArchetype[entry.identityArchetype] = (byArchetype[entry.identityArchetype] || 0) + 1;
    });
    return {
      schemaVersion: SCHEMA_VERSION,
      mapped: total,
      expected: EXPECTED_CITY_COUNT,
      complete: total === EXPECTED_CITY_COUNT,
      byConfidence: byConfidence,
      reviewRequired: reviewRequired,
      byArchetype: byArchetype
    };
  }

  function getCitiesByArchetype(archetypeSlug) {
    if (!archetypeSlug) return [];
    var key = String(archetypeSlug).trim();
    return listCityIdentities().filter(function (entry) {
      return entry.identityArchetype === key;
    });
  }

  window.KairosCityIdentityIndex = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    EXPECTED_CITY_COUNT: EXPECTED_CITY_COUNT,
    CITY_IDENTITY_INDEX: CITY_IDENTITY_INDEX,
    getCityIdentity: getCityIdentity,
    hasCityIdentity: hasCityIdentity,
    listCityIdentities: listCityIdentities,
    getIdentityCoverage: getIdentityCoverage,
    getCitiesByArchetype: getCitiesByArchetype
  };
})();
