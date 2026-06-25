# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**HEAD runtime:** `671a576` — F3.13l E1c  
**Checkpoint F3.13:** `docs/architecture/F3.13P_RESOLVER_EXPANSION_E1C_PRODUCTION_CHECKPOINT.md` (Wave E1 CLOSED)  
**Producción live:** catálogo **`3.8f.1-f3.13c-0.1`** · **61 ciudades / 58 países** · EFR **`3.8h.2-f3.13c-0.1`** · **58 países resolver** · **11 familias** · **WA 10/10**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP — resolver **58 países** · catálogo **61/58** · **Wave E1 cerrada** (8 países WE: E1a+E1b+E1c). Premium beta · 11 familias · WA 10/10 · São Paulo NO catálogo.

**Producción / Staging:** https://kairos-maps-mvp.web.app · https://kairos-maps-dev.web.app — ambos **`f3.13c` · 61/58**.

**Siguiente wave:** **F3.14 — E2 Magreb** (ROI territorial alto · posible familia distinta a WE).

---

## II. Wave E1 — cerrada

| Batch | Commit | Prod |
|-------|--------|------|
| E1a | `0d924cc` | Oslo · Zúrich · Viena |
| E1b | `be5aca5` | Bruselas · Varsovia · Praga |
| E1c | `671a576` | Copenhague · Helsinki |

**Conteo acumulado:** 50→**58** resolver · 53→**61** ciudades · 50→**58** países visibles.

---

## III. SSOT prod

| Métrica | Valor |
|---------|-------|
| Schema resolver | `3.8h.2-f3.13c-0.1` |
| Schema catálogo | `3.8f.1-f3.13c-0.1` |
| WE países resolver | **12** |
| GN canary | Reykjavik / `iceland` |

---

## IV. Smokes gate

Suite E1/E1c — **9/9 PASS** (catálogo · resolver · WE · GN · fallback · WA · LATAM · SA · SEA).

---

## V. Riesgos vivos

- Cache browser `cities-catalog.js`
- Homogeneización WE (12 países)
- 5 smokes drift 6→11 (pre-existente)
- `dist/` sucio local

---

## VI. Git

```
HEAD runtime: 671a576
HEAD doc: F3.13p (post push)
Producción: 61/58 @ f3.13c
```

---

*Checkpoint F3.13p · Wave E1 CLOSED · Siguiente F3.14 E2 Magreb*
