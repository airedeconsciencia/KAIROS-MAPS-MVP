/**
 * KAIROS MAPS — Unified Editorial Family Resolver (Fase 3.8h.2)
 *
 * Fuente canónica única para familias editoriales regionales.
 * Sin DOM, sin UI, sin contenido editorial nuevo.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8h.2-f3.15-0.1';
  var DEFAULT_FAMILY = 'GLOBAL_NEUTRAL';

  var REGISTERED_FAMILIES = [
    'IBERIAN',
    'MEDITERRANEAN',
    'ANGLO',
    'EAST_ASIAN',
    'AFRICAN_COASTAL',
    'LATAM',
    'WESTERN_EUROPE',
    'SOUTHEAST_ASIAN',
    'SOUTH_ASIAN',
    'WEST_AFRICAN',
    'GLOBAL_NEUTRAL'
  ];

  /** @type {Record<string, string>} slug canónico → familia (62 países) */
  var COUNTRY_EDITORIAL_FAMILY = {
    portugal: 'IBERIAN',
    france: 'WESTERN_EUROPE',
    germany: 'WESTERN_EUROPE',
    netherlands: 'WESTERN_EUROPE',
    sweden: 'WESTERN_EUROPE',
    norway: 'WESTERN_EUROPE',
    switzerland: 'WESTERN_EUROPE',
    austria: 'WESTERN_EUROPE',
    belgium: 'WESTERN_EUROPE',
    poland: 'WESTERN_EUROPE',
    czech_republic: 'WESTERN_EUROPE',
    denmark: 'WESTERN_EUROPE',
    finland: 'WESTERN_EUROPE',
    mexico: 'LATAM',
    argentina: 'LATAM',
    brazil: 'LATAM',
    peru: 'LATAM',
    colombia: 'LATAM',
    chile: 'LATAM',
    uruguay: 'LATAM',
    ecuador: 'LATAM',
    costa_rica: 'LATAM',
    panama: 'LATAM',
    thailand: 'SOUTHEAST_ASIAN',
    singapore: 'SOUTHEAST_ASIAN',
    vietnam: 'SOUTHEAST_ASIAN',
    malaysia: 'SOUTHEAST_ASIAN',
    indonesia: 'SOUTHEAST_ASIAN',
    philippines: 'SOUTHEAST_ASIAN',
    india: 'SOUTH_ASIAN',
    pakistan: 'SOUTH_ASIAN',
    bangladesh: 'SOUTH_ASIAN',
    sri_lanka: 'SOUTH_ASIAN',
    nepal: 'SOUTH_ASIAN',
    spain: 'MEDITERRANEAN',
    italy: 'MEDITERRANEAN',
    greece: 'MEDITERRANEAN',
    turkey: 'MEDITERRANEAN',
    morocco: 'MEDITERRANEAN',
    tunisia: 'MEDITERRANEAN',
    united_kingdom: 'ANGLO',
    united_states: 'ANGLO',
    canada: 'ANGLO',
    australia: 'ANGLO',
    new_zealand: 'ANGLO',
    japan: 'EAST_ASIAN',
    south_korea: 'EAST_ASIAN',
    china: 'EAST_ASIAN',
    taiwan: 'EAST_ASIAN',
    south_africa: 'AFRICAN_COASTAL',
    egypt: 'AFRICAN_COASTAL',
    kenya: 'AFRICAN_COASTAL',
    nigeria: 'WEST_AFRICAN',
    ghana: 'WEST_AFRICAN',
    senegal: 'WEST_AFRICAN',
    ivory_coast: 'WEST_AFRICAN',
    sierra_leone: 'WEST_AFRICAN',
    liberia: 'WEST_AFRICAN',
    benin: 'WEST_AFRICAN',
    togo: 'WEST_AFRICAN',
    guinea: 'WEST_AFRICAN',
    gambia: 'WEST_AFRICAN'
  };

  /** @type {Record<string, string>} slug de ciudad → familia (overrides) */
  var CITY_EDITORIAL_FAMILY = {
    lisboa: 'IBERIAN',
    barcelona: 'MEDITERRANEAN',
    toronto: 'ANGLO',
    tokio: 'EAST_ASIAN',
    ciudad_del_cabo: 'AFRICAN_COASTAL'
  };

  var LEGACY_COUNTRY_TO_SLUG = {
    pt: 'portugal',
    portugal: 'portugal',
    fr: 'france',
    france: 'france',
    francia: 'france',
    de: 'germany',
    germany: 'germany',
    alemania: 'germany',
    nl: 'netherlands',
    netherlands: 'netherlands',
    paises_bajos: 'netherlands',
    se: 'sweden',
    sweden: 'sweden',
    suecia: 'sweden',
    no: 'norway',
    norway: 'norway',
    noruega: 'norway',
    ch: 'switzerland',
    switzerland: 'switzerland',
    suiza: 'switzerland',
    at: 'austria',
    austria: 'austria',
    be: 'belgium',
    belgium: 'belgium',
    belgica: 'belgium',
    pl: 'poland',
    poland: 'poland',
    polonia: 'poland',
    cz: 'czech_republic',
    czech_republic: 'czech_republic',
    republica_checa: 'czech_republic',
    dk: 'denmark',
    denmark: 'denmark',
    dinamarca: 'denmark',
    fi: 'finland',
    finland: 'finland',
    finlandia: 'finland',
    ma: 'morocco',
    morocco: 'morocco',
    marruecos: 'morocco',
    tn: 'tunisia',
    tunisia: 'tunisia',
    tunez: 'tunisia',
    mx: 'mexico',
    mexico: 'mexico',
    ar: 'argentina',
    argentina: 'argentina',
    br: 'brazil',
    brazil: 'brazil',
    brasil: 'brazil',
    pe: 'peru',
    peru: 'peru',
    co: 'colombia',
    colombia: 'colombia',
    cl: 'chile',
    chile: 'chile',
    uy: 'uruguay',
    uruguay: 'uruguay',
    ec: 'ecuador',
    ecuador: 'ecuador',
    cr: 'costa_rica',
    costa_rica: 'costa_rica',
    pa: 'panama',
    panama: 'panama',
    th: 'thailand',
    thailand: 'thailand',
    tailandia: 'thailand',
    sg: 'singapore',
    singapore: 'singapore',
    singapur: 'singapore',
    vn: 'vietnam',
    vietnam: 'vietnam',
    my: 'malaysia',
    malaysia: 'malaysia',
    malasia: 'malaysia',
    id: 'indonesia',
    indonesia: 'indonesia',
    ph: 'philippines',
    philippines: 'philippines',
    filipinas: 'philippines',
    in: 'india',
    india: 'india',
    pk: 'pakistan',
    pakistan: 'pakistan',
    bd: 'bangladesh',
    bangladesh: 'bangladesh',
    lk: 'sri_lanka',
    sri_lanka: 'sri_lanka',
    np: 'nepal',
    nepal: 'nepal',
    es: 'spain',
    spain: 'spain',
    espana: 'spain',
    it: 'italy',
    italy: 'italy',
    italia: 'italy',
    gr: 'greece',
    greece: 'greece',
    grecia: 'greece',
    tr: 'turkey',
    turkey: 'turkey',
    turquia: 'turkey',
    gb: 'united_kingdom',
    uk: 'united_kingdom',
    united_kingdom: 'united_kingdom',
    reino_unido: 'united_kingdom',
    us: 'united_states',
    united_states: 'united_states',
    ee_uu: 'united_states',
    ee_uu_: 'united_states',
    eeuu: 'united_states',
    ca: 'canada',
    canada: 'canada',
    au: 'australia',
    australia: 'australia',
    nz: 'new_zealand',
    new_zealand: 'new_zealand',
    nueva_zelandia: 'new_zealand',
    jp: 'japan',
    japan: 'japan',
    japon: 'japan',
    kr: 'south_korea',
    south_korea: 'south_korea',
    corea_del_sur: 'south_korea',
    cn: 'china',
    china: 'china',
    tw: 'taiwan',
    taiwan: 'taiwan',
    za: 'south_africa',
    south_africa: 'south_africa',
    sudafrica: 'south_africa',
    eg: 'egypt',
    egypt: 'egypt',
    egipto: 'egypt',
    ke: 'kenya',
    kenya: 'kenya',
    kenia: 'kenya',
    ng: 'nigeria',
    nigeria: 'nigeria',
    gh: 'ghana',
    ghana: 'ghana',
    sn: 'senegal',
    senegal: 'senegal',
    ci: 'ivory_coast',
    ivory_coast: 'ivory_coast',
    cote_divoire: 'ivory_coast',
    costa_de_marfil: 'ivory_coast',
    sl: 'sierra_leone',
    sierra_leone: 'sierra_leone',
    sierra_leona: 'sierra_leone',
    lr: 'liberia',
    liberia: 'liberia',
    bj: 'benin',
    benin: 'benin',
    tg: 'togo',
    togo: 'togo',
    gn: 'guinea',
    guinea: 'guinea',
    gm: 'gambia',
    gambia: 'gambia'
  };

  function normalizeKey(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/[.\s]+/g, '_')
      .replace(/-/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  function normalizeCityKey(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function citySlugFromName(cityName) {
    var key = normalizeCityKey(cityName);
    if (key.indexOf('ciudad del cabo') !== -1 || key === 'cape town') {
      return 'ciudad_del_cabo';
    }
    return key.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  }

  function isCanonicalCountrySlug(value) {
    return !!(value && Object.prototype.hasOwnProperty.call(COUNTRY_EDITORIAL_FAMILY, value));
  }

  function coerceCountryId(raw) {
    if (raw == null || raw === '') return null;

    var normalized = normalizeKey(raw);
    if (isCanonicalCountrySlug(normalized)) return normalized;

    if (LEGACY_COUNTRY_TO_SLUG[normalized]) {
      return LEGACY_COUNTRY_TO_SLUG[normalized];
    }

    var Catalog = window.KairosCitiesCatalog;
    if (Catalog) {
      if (Catalog.COUNTRY_IDS && Catalog.COUNTRY_IDS[raw]) {
        return Catalog.COUNTRY_IDS[raw];
      }
      if (typeof Catalog.resolveCountryId === 'function') {
        var fromCatalog = Catalog.resolveCountryId(raw);
        if (fromCatalog && isCanonicalCountrySlug(fromCatalog)) {
          return fromCatalog;
        }
      }
    }

    var legacySlug = normalized.replace(/-/g, '_');
    if (isCanonicalCountrySlug(legacySlug)) return legacySlug;

    return null;
  }

  function resolveEditorialFamily(opts) {
    opts = opts || {};

    var citySlug = citySlugFromName(opts.cityName);
    if (citySlug && CITY_EDITORIAL_FAMILY[citySlug]) {
      return CITY_EDITORIAL_FAMILY[citySlug];
    }

    var countryRaw = opts.countryId != null && opts.countryId !== ''
      ? opts.countryId
      : (opts.countryDisplay != null ? opts.countryDisplay : opts.country);
    var countryId = coerceCountryId(countryRaw);

    if (countryId && COUNTRY_EDITORIAL_FAMILY[countryId]) {
      return COUNTRY_EDITORIAL_FAMILY[countryId];
    }

    return DEFAULT_FAMILY;
  }

  function isRegisteredFamily(id) {
    return !!(id && REGISTERED_FAMILIES.indexOf(id) !== -1);
  }

  function resolveRegionFamily(cityName, countryId) {
    return resolveEditorialFamily({ cityName: cityName, countryId: countryId });
  }

  function resolveRegionalPack(map, regionFamily, opts) {
    opts = opts || {};
    map = map || {};
    var fallbackFamily = opts.fallbackFamily != null ? opts.fallbackFamily : DEFAULT_FAMILY;
    var requested = regionFamily || fallbackFamily;

    if (Object.prototype.hasOwnProperty.call(map, requested) && map[requested]) {
      return {
        pack: map[requested],
        meta: {
          requestedFamily: requested,
          effectiveFamily: requested,
          resolvedFrom: 'explicit'
        }
      };
    }

    if (requested !== fallbackFamily &&
        Object.prototype.hasOwnProperty.call(map, fallbackFamily) &&
        map[fallbackFamily]) {
      return {
        pack: map[fallbackFamily],
        meta: {
          requestedFamily: requested,
          effectiveFamily: fallbackFamily,
          resolvedFrom: 'default'
        }
      };
    }

    return {
      pack: null,
      meta: {
        requestedFamily: requested,
        effectiveFamily: null,
        resolvedFrom: 'missing'
      }
    };
  }

  window.KairosEditorialFamily = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    DEFAULT_FAMILY: DEFAULT_FAMILY,
    REGISTERED_FAMILIES: REGISTERED_FAMILIES,
    COUNTRY_EDITORIAL_FAMILY: COUNTRY_EDITORIAL_FAMILY,
    CITY_EDITORIAL_FAMILY: CITY_EDITORIAL_FAMILY,
    coerceCountryId: coerceCountryId,
    isRegisteredFamily: isRegisteredFamily,
    resolveEditorialFamily: resolveEditorialFamily,
    resolveRegionFamily: resolveRegionFamily,
    resolveRegionalPack: resolveRegionalPack
  };
})();
