(function () {
  'use strict';

  const BASE = 'assets/kairos_symbols/planets/';

  const FILES = {
    sol: 'sun.svg',
    luna: 'moon.svg',
    mercurio: 'mercury.svg',
    venus: 'venus.svg',
    marte: 'mars.svg',
    jupiter: 'jupiter.svg',
    saturno: 'saturn.svg',
    urano: 'uranus.svg',
    neptuno: 'neptune.svg',
    pluton: 'pluto.svg'
  };

  const cache = {};
  const readyCallbacks = [];
  let loaded = false;

  function notifyReady() {
    loaded = true;
    while (readyCallbacks.length) {
      const fn = readyCallbacks.shift();
      fn();
    }
  }

  function whenReady(fn) {
    if (loaded) fn();
    else readyCallbacks.push(fn);
  }

  Promise.all(
    Object.entries(FILES).map(([id, file]) =>
      fetch(BASE + file)
        .then((res) => {
          if (!res.ok) throw new Error('SVG ' + file);
          return res.text();
        })
        .then((svg) => {
          cache[id] = svg;
        })
    )
  )
    .then(notifyReady)
    .catch((err) => {
      console.warn('[KairosPlanetGlyphs] Error cargando SVG:', err);
      notifyReady();
    });

  function html(planetId, options) {
    const opts = options || {};
    const file = FILES[planetId];
    if (!file) return '';

    const className = ['kairos-glyph', opts.className].filter(Boolean).join(' ');
    const colorStyle = opts.color ? `color:${opts.color}` : '';
    const svg = cache[planetId];

    if (svg) {
      return `<span class="${className}" style="${colorStyle}" aria-hidden="true">${svg}</span>`;
    }

    return `<span class="${className}" style="${colorStyle}" aria-hidden="true"><img class="kairos-glyph-img" src="${BASE}${file}" alt=""></span>`;
  }

  window.KairosPlanetGlyphs = { html, whenReady };
})();
