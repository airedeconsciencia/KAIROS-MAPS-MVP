(function () {
  'use strict';

  async function nominatimSearch(q) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=es`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Nominatim error');
    const data = await res.json();
    return data.map((r) => ({
      name: (r.display_name || '').split(',')[0].trim() || r.display_name,
      fullName: r.display_name,
      country: ((r.display_name || '').split(',').pop() || '').trim(),
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon)
    }));
  }

  window.KairosPlaces = { nominatimSearch };
})();
