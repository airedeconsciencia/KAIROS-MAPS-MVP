# KAIROS MAPS — Current State @ F7.10

**Snapshot:** cierre F7.10 Identity Architecture Checkpoint  
**Fecha:** 26 mayo 2026  
**Rama:** `main`

> Estado exacto para handover. Cruzar siempre con `KAIROS_CURRENT_CHECKPOINT.md` (checkpoint vivo).

---

## 1. HEAD y commits relevantes

| Dimensión | Valor |
|-----------|-------|
| **HEAD repo (post F7.11)** | pendiente commit `f7.11` |
| **HEAD identity doc** | `5df8488` — `f7.10 identity architecture checkpoint` |
| **HEAD identity code** | `d14bbbc` — `f7.9c shadow signature sync` |
| **HEAD runtime prod** | `3c6019a` — `f6.3 anglo closure suriname paramaribo` |
| **HEAD prod checkpoint** | `da88c30` — `f6.3 anglo closure production checkpoint` |
| **Remoto** | `main` sincronizado post-push F7.10 |

### Cadena identity (local → remoto)

```
7e918b7 f7.5d identity modulation engine coefficients
25b0526 f7.5e city identity index mapping
181eefc f7.8b shadow analytics json export
d14bbbc f7.9c shadow signature sync
5df8488 f7.10 identity architecture checkpoint
```

---

## 2. Métricas producción

| Métrica | Valor |
|---------|-------|
| Ciudades catálogo | **106** |
| Países resolver | **103** |
| Familias editoriales | **12** |
| Schema catálogo live | `3.8f.1-f6.3-0.1` |
| Schema resolver live | `3.8h.2-f6.3-0.1` |
| Split-brain casos | **0** (97 verificados) |
| GN canario | Reykjavik / `iceland` → `GLOBAL_NEUTRAL` |

### Familias por saturación resolver

| Familia | Países | Estado |
|---------|--------|--------|
| WESTERN_EUROPE | 14 | 🔒 congelada |
| LATAM | 12 | 🔒 congelada |
| ANGLO | 12 | ⚠️ umbral editorial |
| WEST_AFRICAN | 13 | 🔒 congelada |
| AFRICAN_COASTAL | 12 | 🔒 congelada |
| SOUTHEAST_ASIAN | 11 | activa |
| MENA | 8 | activa |
| MEDITERRANEAN | 7 | activa |
| SOUTH_ASIAN | 8 | activa |
| EAST_ASIAN | 5 | activa |
| + 2 adicionales | — | ver resolver SSOT |

---

## 3. Estado F6 (producción territorial)

| Wave | Estado | Commit / nota |
|------|--------|---------------|
| F6.0 MENA Architecture Sprint | ✅ Cerrada | packs · 0 países |
| F6.1 MENA Migration | ✅ Cerrada | AE/QA/SA/IL/JO |
| F6.2 MENA Expansion | ✅ Cerrada | LB/KW/OM |
| F6.3 ANGLO Closure | ✅ Cerrada · **LIVE** | Surinam/Paramaribo |

**Prod URL:** https://kairos-maps-mvp.web.app  
**Staging URL:** https://kairos-maps-dev.web.app  
**Premium beta:** `?premium=1` o `localStorage kairosPremiumBeta=1`

**Último deploy prod:** F6.3 @ runtime `3c6019a`. Sin redeploy post-F7.

---

## 4. Estado F7 (identity shadow)

| Fase | Estado | Entregable |
|------|--------|------------|
| F7.5A Dimensions catalog | ✅ | `identity-dimensions.js` `7.5a-0.1` |
| F7.5B Archetypes | ✅ | `city-identity-archetypes.js` · 28 arquetipos |
| F7.5C Dimension profiles | ✅ | `identity-modulation-profile.js` · 28 perfiles |
| F7.5D Modulation engine | ✅ | `identity-modulation-service.js` |
| F7.5E City index | ✅ | `city-identity-index.js` · 106 mappings |
| F7.7 Shadow runtime | ✅ | `identity-shadow-runtime-service.js` |
| F7.8 Shadow analytics | ✅ | `shadow-analytics-service.js` + export |
| F7.9B City signatures | ✅ | `city-signatures.js` · 106 firmas |
| F7.9C Shadow signature sync | ✅ | effective profile unificado |
| F7.10 Architecture SSOT | ✅ | `CITY_IDENTITY_ARCHITECTURE.md` |
| F7.11 Handover pack | 🔄 Este commit | 4 docs handover |

### Invariantes identity (verificados en smokes)

- `modulation.enabled = false`
- `runtimeImpact: none` · `modulationApplied: false`
- Sin imports en narrative / premium / knowledge / `app.js`
- Sin efecto en producción

### Archivos identity (tracked @ F7.9C)

| Archivo | Schema |
|---------|--------|
| `src/content/city-identity-archetypes.js` | `7.5b-0.1` |
| `src/content/identity-dimensions.js` | `7.5a-0.1` |
| `src/content/identity-modulation-profile.js` | `7.5c-0.1` |
| `src/content/city-identity-index.js` | `7.5e-0.1` |
| `src/content/city-signatures.js` | `7.9b-0.1` |
| `src/services/identity-modulation-service.js` | `7.5e-0.1` |
| `src/services/identity-shadow-runtime-service.js` | `7.9c-0.1` |
| `src/services/shadow-comparison-service.js` | `7.9c-0.1` |
| `src/services/shadow-analytics-service.js` | `7.9c-0.1` |

### Archivos identity (untracked local — pendiente commit futuro)

- `src/services/identity-calibration-service.js` (`7.9b-0.1`)
- `src/dev/identity-calibration-preview.html`

Smokes de calibration existen y pasan; código aún no commiteado en `main`.

---

## 5. Shadow runtime

Flujo unificado post-F7.9C:

```
citySlug → identityArchetype → baseProfile → citySignature
  → effectiveProfile → modulationCoefficients (enabled: false)
  → Shadow Runtime / Comparison / Analytics / Calibration
```

**DEV previews (no prod):**

- `src/dev/identity-modulation-preview.html`
- `src/dev/identity-shadow-preview.html`
- `src/dev/shadow-analytics-preview.html`
- `src/dev/identity-calibration-preview.html`

---

## 6. Smokes

### Producción (@ F6.3) — 10/10 PASS

9 estándar + `scripts/dev-mena-architecture-smoke.sh`

### Identity (DEV-only @ F7.9C)

| Script | Fase |
|--------|------|
| `scripts/dev-identity-modulation-smoke.sh` | F7.5E |
| `scripts/dev-identity-shadow-runtime-smoke.sh` | F7.9C |
| `scripts/dev-shadow-analytics-smoke.sh` | F7.9C |
| `scripts/dev-shadow-analytics-export-smoke.sh` | F7.8B |
| `scripts/dev-identity-calibration-smoke.sh` | F7.9B |

---

## 7. Deploy status

| Entorno | Estado | Nota |
|---------|--------|------|
| **Producción** | F6.3 live @ `3c6019a` | Sin deploy identity |
| **Staging** | Alineado F6.3 | Sin cambios post-F7 |
| **Identity** | DEV previews + smokes | No desplegado |
| **`dist/` local** | Sucio · no commitear | rsync artefacto deploy |

**Política:** `./scripts/deploy-prod.sh` solo con gate explícito + smokes PASS + aprobación.

---

## 8. Git posture

| Campo | Valor |
|-------|-------|
| Rama activa | `main` |
| Remoto | `origin/main` — up to date post F7.10 push |
| `src/` prod | Limpio salvo untracked calibration |
| `dist/` | Modificado + untracked — **no commitear** |
| `tmp/` | Untracked — export shadow analytics |

---

## 9. Riesgos vivos

### Territorial / prod

- Cache browser `cities-catalog.js` / `editorial-family-resolver.js`
- **ANGLO @ 12** — umbral editorial; no expandir sin F7.0 audit
- Lecturas MENA live — anti-leak (Dubái · Tel Aviv · Beirut)
- Israel · Líbano — países sensibles
- Familias congeladas: WE · LATAM · WA · AC

### Identity

- **7 ciudades `review_required`** (confidence B): Belmopán, Kabul, Beirut, Addis Abeba, Lomé, Banjul, Niamey
- **106 signatures algorítmicas** — no curadas editorialmente
- Cluster `resilient_ordinariness` en West Africa — riesgo homogeneización
- Activación sin QA editorial — riesgo principal F8.x
- Dos sistemas naming dimensiones (legacy `7.5a` vs profile `7.5c`)

### Repo

- `dist/` sucio local puede confundir al agente — ignorar como SSOT
- Calibration service sin commit — smokes pasan pero no está en remoto

---

## 10. Siguiente fase

**F8.0 — Identity Feature Flag DEV** — gate antes de integración narrative/premium.

Ver `KAIROS_NEXT_AGENT_BOOTSTRAP.md` para primer prompt sugerido.

---

*Snapshot F7.10 · 106/103 · identity shadow-ready · runtime prod intacto @ f6.3*
