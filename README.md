# Grimoire — D&D Companion for Meta Ray-Ban Display

A glanceable, D-pad-navigable **D&D companion** for the tabletop, built as a
standalone web app for the **Meta Ray-Ban Display (MRBD / Hypernova)**. Started
as a spellbook; now a modular companion covering spells, character modifiers,
combat order, and dice.

## Modules
| Module | What it does | Use cases (from spec) |
|--------|--------------|------------------------|
| **Character** | View combat modifiers (ability mods, initiative, spell save DC / attack); edit stats | "remember a character sheet", "display modifiers for combat" |
| **Spells** | Browse by class → level → spell; ★ favorites carousel; per-level spell-slot tracker; find-by-letter search | list spells, favorite/swipe, count per level, (voice search = Phase 2) |
| **Combat** | Initiative order tracker: add combatants, sort by initiative, step turns, round counter | "see the character order in combat" |
| **Dice** | Roll calculator that auto-applies modifiers (die × count + flat mod + ability/prof) | "tell you totals, accounting for modifiers" (camera reader = Phase 2) |

## Files
```
index.html          600×600 stage; loads data + core + modules
styles.css          additive-display styling (black = transparent, 550 safe area)
data/spells.js      bundled SRD spell dataset (window.SPELLS, 132 spells, all 9 levels)
js/store.js         localStorage state (character + combat) + derived modifiers
js/ui.js            App screen-stack + reusable ListScreen + render helpers
js/spells.js        Spells module
js/character.js     Character module (+ importFromJSON hook)
js/combat.js        Combat / initiative module
js/dice.js          Dice roller module
js/app.js           home hub + global D-pad input wiring
.nojekyll           serve files as-is on GitHub Pages
```

## Controls (D-pad / Neural Band)
The Neural Band drives the app as D-pad input (pinch = select, swipes = arrows),
so everything is reachable with 5 inputs. Two conventions:
- **Navigator screens:** ▲▼ move · ● / ▶ open · ◀ back
- **Editor screens:** ▲▼ pick field · ◀▶ adjust value · ● done/roll

Each screen shows its exact controls in the footer hint.

## Run locally
```
cd dnd-spell-glasses
python3 -m http.server 8000    # then open http://localhost:8000
```
Drive with **arrow keys + Enter** exactly like the D-pad.

## MRBD constraints honored
- **600×600** display, content in a **550×550** safe area.
- **Additive optics:** black is transparent — all UI is light text / bright outlines.
- **D-pad-only** input via `keydown` on `window` (matches how MRBD delivers the
  D-pad + Neural Band click).
- **~60px focus targets**, visible selection highlight, semantic HTML,
  `prefers-reduced-motion` respected.
- **Public HTTPS** hosting (GitHub Pages) — no auth-gated URLs.

## Deploy to GitHub Pages
```
cd dnd-spell-glasses
git init && git add . && git commit -m "Grimoire MRBD companion"
git branch -M main
git remote add origin https://github.com/<you>/dnd-spell-glasses.git
git push -u origin main
```
Repo → **Settings → Pages → Deploy from a branch → `main` / root**.
Live at `https://<you>.github.io/dnd-spell-glasses/`.

## Verify in the MRBD Simulator, then the glasses
1. Install the **MRBD Web App Simulator** Chrome extension; load your URL; confirm
   the 600×600 additive frame + D-pad input; run its QA checklist.
2. On glasses: Meta AI app (C50, Developer Mode) → **Device Settings → App
   Connections → Web App Dev Mode**, paste your Pages URL. Or use the simulator's
   **"View on Glasses"** QR.

## Roadmap (Phase 2 — capability-gated, verify first)
These depend on MRBD web-app capabilities that are gated/uncertain today:
- **Voice search** for spells — dictation is GK-gated (`web_on_hn_dictation`) and
  was still buggy as of mid-2026. D-pad find-by-letter is the v1 fallback.
- **Camera dice reader** — "look at physical dice" via the glasses camera; camera
  access for web apps is undocumented/gated. Manual calculator ships in Phase 1.
- **Character sheet import (PDF / photo OCR)** — load a sheet instead of entering
  stats by hand; deferred. For now, enter/edit your character in the Character module.
- **Meta AI integration** — a web app cannot query the on-glasses Meta AI assistant
  today (no bridge; that's internal/native-only). Revisit if the platform opens it.

## Expanding the spell list
`data/spells.js` holds 132 spells spanning cantrips through level 9 across all core
classes. To load the full ~319-spell SRD, replace the `window.SPELLS` array with the
complete dataset using the same schema — no other code changes needed. A good open
source is the 5e SRD JSON from the `dnd5eapi` project.

---
*Spell content: D&D 5e SRD 5.1, © Wizards of the Coast, CC-BY-4.0 / OGL.
Descriptions condensed for display.*
