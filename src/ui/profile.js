(function () {
  'use strict';

  const STORAGE_KEY = 'kairos_maps_profile';

  const GOAL_TO_ASPECT = {
    amor: 'amor',
    trabajo: 'trabajo',
    descanso: 'descanso',
    profesion: 'trabajo',
    cambio: 'descanso',
    viaje: 'descanso'
  };

  function getProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[KairosProfile] Error leyendo perfil:', e);
      return null;
    }
  }

  function saveProfile(data) {
    const current = getProfile() || {};
    const next = Object.assign({}, current, data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function clearProfile() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function hasCompletedProfile() {
    const p = getProfile();
    return !!(p && p.onboardingCompleted && p.displayName && p.birthData && p.mainGoal);
  }

  function mapGoalToAspect(mainGoal) {
    if (window.KairosGoalSignal && typeof window.KairosGoalSignal.resolveAspectKey === 'function') {
      const aspect = window.KairosGoalSignal.resolveAspectKey(mainGoal);
      if (aspect) return aspect;
    }
    return GOAL_TO_ASPECT[mainGoal] || 'amor';
  }

  window.KairosProfile = {
    STORAGE_KEY,
    GOAL_TO_ASPECT,
    getProfile,
    saveProfile,
    clearProfile,
    hasCompletedProfile,
    mapGoalToAspect
  };
})();
