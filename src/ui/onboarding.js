(function () {
  'use strict';

  const GOALS = [
    { id: 'amor', label: 'Amor' },
    { id: 'trabajo', label: 'Trabajo' },
    { id: 'descanso', label: 'Descanso' },
    { id: 'profesion', label: 'Profesión' },
    { id: 'cambio', label: 'Cambio vital' },
    { id: 'viaje', label: 'Viaje' }
  ];

  function initOnboarding(options) {
    const onComplete = options && options.onComplete;
    const root = document.getElementById('onboarding');
    const appEl = document.querySelector('.app');
    if (!root || !appEl) return;

    const draft = {
      displayName: '',
      mainGoal: '',
      birthData: null
    };

    let placeFull = '';
    let placeSearchDebounce = null;
    let placeSearchSeq = 0;

    let step = 1;
    const steps = root.querySelectorAll('.onboarding-step');
    const finalTitle = document.getElementById('ob-final-title');

    function showStep(n) {
      step = n;
      steps.forEach((el) => {
        el.classList.toggle('active', parseInt(el.dataset.step, 10) === n);
      });
      if (n === 5 && finalTitle) {
        const name = draft.displayName.trim() || 'Tú';
        finalTitle.textContent = name + ', vamos a construir tu mapa.';
      }
    }

    function finish(profile) {
      root.hidden = true;
      appEl.hidden = false;
      if (typeof onComplete === 'function') onComplete(profile);
    }

    if (window.KairosProfile.hasCompletedProfile()) {
      root.hidden = true;
      appEl.hidden = false;
      finish(window.KairosProfile.getProfile());
      return;
    }

    root.hidden = false;
    appEl.hidden = true;
    showStep(1);

    const tzSource = document.getElementById('natal-tz');
    const tzTarget = document.getElementById('ob-natal-tz');
    if (tzSource && tzTarget && !tzTarget.options.length) {
      tzTarget.innerHTML = tzSource.innerHTML;
      tzTarget.value = 'Europe/Madrid';
    }

    root.querySelectorAll('[data-action="next"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = parseInt(btn.dataset.next, 10);
        if (target === 2 && step === 1) showStep(2);
        else if (target === 3 && step === 2) {
          const name = document.getElementById('ob-name').value.trim();
          if (!name) {
            document.getElementById('ob-name-error').hidden = false;
            return;
          }
          document.getElementById('ob-name-error').hidden = true;
          draft.displayName = name;
          showStep(3);
        } else if (target === 4 && step === 3) {
          const birthData = readBirthStep();
          if (!birthData) return;
          draft.birthData = birthData;
          showStep(4);
        } else if (target === 5 && step === 4) {
          const selected = root.querySelector('.goal-option.selected');
          if (!selected) {
            document.getElementById('ob-goal-error').hidden = false;
            return;
          }
          document.getElementById('ob-goal-error').hidden = true;
          draft.mainGoal = selected.dataset.goal;
          showStep(5);
        } else if (target === 0 && step === 5) {
          const profile = window.KairosProfile.saveProfile({
            onboardingCompleted: true,
            displayName: draft.displayName.trim(),
            mainGoal: draft.mainGoal,
            birthData: draft.birthData
          });
          finish(profile);
        }
      });
    });

    (function initPlaceSearch() {
      const input = document.getElementById('ob-natal-place');
      const results = document.getElementById('ob-place-results');
      if (!input || !results || !window.KairosPlaces) return;

      function closeResults() {
        results.classList.remove('open');
        results.innerHTML = '';
      }

      function renderResults(matches) {
        if (!matches.length) {
          closeResults();
          return;
        }
        results.innerHTML = matches.map((r, i) => `
          <div class="search-result" data-idx="${i}">
            <div class="name">${r.name}</div>
            <div class="meta">${r.fullName.length > 70 ? r.fullName.slice(0, 70) + '…' : r.fullName}</div>
          </div>`).join('');
        results.classList.add('open');
        results.querySelectorAll('.search-result').forEach((el) => {
          el.addEventListener('click', () => {
            const r = matches[parseInt(el.dataset.idx, 10)];
            input.value = r.name;
            placeFull = r.fullName;
            document.getElementById('ob-natal-lat').value = r.lat;
            document.getElementById('ob-natal-lon').value = r.lon;
            closeResults();
          });
        });
      }

      input.addEventListener('input', () => {
        placeFull = '';
        const q = input.value.trim();
        clearTimeout(placeSearchDebounce);
        if (!q || q.length < 3) {
          closeResults();
          return;
        }
        const mySeq = ++placeSearchSeq;
        placeSearchDebounce = setTimeout(async () => {
          try {
            const remote = await window.KairosPlaces.nominatimSearch(q);
            if (mySeq !== placeSearchSeq) return;
            renderResults(remote);
          } catch (e) {
            console.warn('Nominatim falló:', e);
          }
        }, 450);
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.ob-place-search')) closeResults();
      });
    })();

    root.querySelectorAll('.goal-option').forEach((el) => {
      el.addEventListener('click', () => {
        root.querySelectorAll('.goal-option').forEach((o) => o.classList.remove('selected'));
        el.classList.add('selected');
        document.getElementById('ob-goal-error').hidden = true;
      });
    });

    function readBirthStep() {
      const err = document.getElementById('ob-birth-error');
      const date = document.getElementById('ob-natal-date').value;
      const time = document.getElementById('ob-natal-time').value;
      const timezone = document.getElementById('ob-natal-tz').value;
      const place = document.getElementById('ob-natal-place').value.trim();
      const lat = parseFloat(document.getElementById('ob-natal-lat').value);
      const lon = parseFloat(document.getElementById('ob-natal-lon').value);

      if (!date || !time || !place || Number.isNaN(lat) || Number.isNaN(lon)) {
        if (err) {
          err.textContent = 'Completa fecha, hora, lugar y coordenadas válidas.';
          err.hidden = false;
        }
        return null;
      }
      if (err) err.hidden = true;
      return { date, time, timezone, place, placeFull: placeFull || place, lat, lon };
    }
  }

  window.initOnboarding = initOnboarding;
})();
