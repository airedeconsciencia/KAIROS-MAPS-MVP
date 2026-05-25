/**
 * KAIROS MAPS — kairos-core bootstrap (Fase 2.1a)
 * ES module: init Swiss Ephemeris WASM and expose readiness.
 * Not wired to index.html until a later phase.
 */
import SwissEph from './wasm/swisseph_wrapper.js';

async function initKairosCore() {
  if (window.swisseph_native?._kairosReady) {
    return window.swisseph_native;
  }

  const swe = new SwissEph();
  await swe.initSwissEph();
  swe.set_ephe_path('sweph');
  swe._kairosReady = true;

  window.swisseph_native = swe;

  window.__kairosCoreReady = (async () => {
    if (typeof initPlanetaryEngine === 'function') {
      await initPlanetaryEngine();
      window.swisseph_native.set_ephe_path('sweph');
    }
  })();

  return swe;
}

window.initKairosCore = initKairosCore;
initKairosCore();
