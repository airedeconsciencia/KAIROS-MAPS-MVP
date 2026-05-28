/**
 * Kairos Maps — natal-engine-loader (Fase 3.1b)
 * Carga bajo demanda scripts clásicos + bootstrap module de kairos-core.
 * Idempotente: no-op si ya están presentes (p. ej. index.html legacy).
 */
(function () {
  'use strict';

  var CLASSIC_FILES = [
    'aspects_engine.js',
    'planetary_engine.js',
    'chart_engine.js'
  ];

  var _loadPromise = null;
  var _loaded = false;

  function getLoaderScript() {
    return document.querySelector('script[src*="natal-engine-loader.js"]');
  }

  function engineUrl(fileName) {
    var script = getLoaderScript();
    if (script) {
      return new URL('../engines/kairos-core/' + fileName, script.src).href;
    }
    return 'engines/kairos-core/' + fileName;
  }

  function isReady() {
    return (
      typeof window.generateFullChart === 'function' &&
      typeof window.initPlanetaryEngine === 'function' &&
      typeof window.initKairosCore === 'function'
    );
  }

  function scriptAlreadyPresent(src) {
    var scripts = document.querySelectorAll('script[src]');
    for (var i = 0; i < scripts.length; i++) {
      var href = scripts[i].src;
      if (href === src || href.endsWith('/' + src.split('/').pop())) return true;
    }
    return !!document.querySelector('script[data-kairos-natal-src="' + src + '"]');
  }

  function loadClassicScript(src) {
    if (scriptAlreadyPresent(src)) {
      return Promise.resolve();
    }

    return new Promise(function (resolve, reject) {
      var el = document.createElement('script');
      el.src = src;
      el.setAttribute('data-kairos-natal-src', src);
      el.onload = function () { resolve(); };
      el.onerror = function () {
        reject(new Error('No se pudo cargar script natal: ' + src));
      };
      document.head.appendChild(el);
    });
  }

  function loadBootstrapModule() {
    if (typeof window.initKairosCore === 'function') {
      return Promise.resolve();
    }

    var bootstrapUrl = engineUrl('bootstrap.js');
    return import(bootstrapUrl);
  }

  function loadNatalEngineScripts() {
    if (isReady()) {
      _loaded = true;
      return Promise.resolve({ loaded: true, skipped: true });
    }

    if (_loadPromise) return _loadPromise;

    _loadPromise = (async function () {
      for (var i = 0; i < CLASSIC_FILES.length; i++) {
        await loadClassicScript(engineUrl(CLASSIC_FILES[i]));
      }

      await loadBootstrapModule();

      if (!isReady()) {
        throw new Error('Motor natal incompleto tras carga lazy');
      }

      _loaded = true;
      return { loaded: true, skipped: false };
    })().catch(function (err) {
      _loadPromise = null;
      throw err;
    });

    return _loadPromise;
  }

  function getStatus() {
    return {
      loaded: _loaded,
      ready: isReady(),
      loadInFlight: !!_loadPromise && !_loaded
    };
  }

  window.KairosNatalEngineLoader = {
    isReady: isReady,
    load: loadNatalEngineScripts,
    getStatus: getStatus
  };
})();
