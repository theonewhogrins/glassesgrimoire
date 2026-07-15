/*
 * Character module — view combat modifiers, edit stats.
 * Covers use cases: "remember a character sheet" and "display modifiers for combat".
 * Photo/OCR import of a paper sheet is Phase 2 (camera-gated); a JSON import hook
 * is stubbed in importFromJSON() for desktop/paste use.
 */
window.Character = (function () {
  "use strict";
  var ABIL = [
    { key: "str", name: "STR" }, { key: "dex", name: "DEX" }, { key: "con", name: "CON" },
    { key: "int", name: "INT" }, { key: "wis", name: "WIS" }, { key: "cha", name: "CHA" }
  ];
  var SPELL_ABILITIES = ["int", "wis", "cha"];
  var CLASS_LIST = ["Artificer", "Barbarian", "Bard", "Cleric", "Druid", "Fighter",
    "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"];

  function view() {
    return ListScreen({
      title: function () { return Store.character().name; },
      sub: function () {
        var c = Store.character();
        return c.cls + " · Level " + c.level;
      },
      hint: "▲▼ Move   ● Edit   ◀ Back",
      rows: function () {
        var c = Store.character();
        var rows = ABIL.map(function (a) {
          var score = c.abilities[a.key];
          return { main: a.name, meta: score + "  (" + Store.fmt(Store.mod(score)) + ")" };
        });
        rows.unshift({ main: "AC", meta: String(c.ac) });
        rows.unshift({ main: "Hit Points", meta: c.hp.cur + " / " + c.hp.max });
        rows.push({ main: "Proficiency", meta: Store.fmt(c.proficiency) });
        rows.push({ main: "Initiative", meta: Store.fmt(Store.mod(c.abilities.dex)) });
        rows.push({ main: "Spell ability", meta: c.spellAbility.toUpperCase() });
        rows.push({ main: "Spell save DC", meta: String(Store.spellSaveDC()) });
        rows.push({ main: "Spell attack", meta: Store.fmt(Store.spellAttack()) });
        // Any row opens the editor.
        rows.forEach(function (r) { r.onSelect = function () { App.push(edit()); }; });
        rows.push({ main: "Edit character", onSelect: function () { App.push(edit()); } });
        rows.push({ main: "⚙ Home stats", onSelect: function () { App.push(hudPicker()); } });
        return rows;
      }
    });
  }

  // Editor: Up/Down pick field, Left/Right adjust, Select = edit name / Done.
  function edit() {
    var field = 0;
    // Build the list of editable fields. kind marks fields that use Select
    // (name -> opens name editor; done -> saves & backs out) instead of adjust.
    function fields() {
      var c = Store.character();
      var list = [
        { label: "Name", kind: "name", get: function () { return c.name; } },
        { label: "Class", get: function () { return c.cls; },
          adjust: function (d) {
            var i = CLASS_LIST.indexOf(c.cls); if (i < 0) i = 0;
            c.cls = CLASS_LIST[(i + d + CLASS_LIST.length) % CLASS_LIST.length];
          } },
        { label: "Level", get: function () { return c.level; },
          adjust: function (d) { c.level = clamp(c.level + d, 1, 20); } },
        { label: "Max HP", get: function () { return c.hp.max; },
          adjust: function (d) { c.hp.max = clamp(c.hp.max + d, 0, 999); if (c.hp.cur > c.hp.max) c.hp.cur = c.hp.max; } },
        { label: "Current HP", get: function () { return c.hp.cur; },
          adjust: function (d) { c.hp.cur = clamp(c.hp.cur + d, 0, c.hp.max); } },
        { label: "AC", get: function () { return c.ac; },
          adjust: function (d) { c.ac = clamp(c.ac + d, 0, 30); } }
      ];
      ABIL.forEach(function (a) {
        list.push({
          label: a.name, get: function () { return c.abilities[a.key] + " (" + Store.fmt(Store.mod(c.abilities[a.key])) + ")"; },
          adjust: function (d) { c.abilities[a.key] = clamp(c.abilities[a.key] + d, 1, 30); }
        });
      });
      list.push({ label: "Proficiency", get: function () { return Store.fmt(c.proficiency); },
        adjust: function (d) { c.proficiency = clamp(c.proficiency + d, 0, 9); } });
      list.push({ label: "Spell ability", get: function () { return c.spellAbility.toUpperCase(); },
        adjust: function (d) {
          var i = SPELL_ABILITIES.indexOf(c.spellAbility);
          c.spellAbility = SPELL_ABILITIES[(i + d + SPELL_ABILITIES.length) % SPELL_ABILITIES.length];
        } });
      list.push({ label: "✓ Done", kind: "done", get: function () { return ""; } });
      return list;
    }

    return {
      render: function () {
        var f = fields();
        var rows = f.map(function (x) { return { main: x.label, meta: String(x.get()) }; });
        App.el.innerHTML = UI.listHTML("Edit character", "Save DC " + Store.spellSaveDC(), rows, field);
        App.setHint("▲▼ Field   ◀▶ Adjust   ● Edit / Done");
        UI.scrollSelected();
      },
      onKey: function (dir) {
        var f = fields();
        var cur = f[field];
        if (dir === "up") field = (field - 1 + f.length) % f.length;
        else if (dir === "down") field = (field + 1) % f.length;
        else if (dir === "left") { if (cur.adjust) { cur.adjust(-1); Store.save(); } }
        else if (dir === "right") { if (cur.adjust) { cur.adjust(1); Store.save(); } }
        else if (dir === "select") {
          if (cur.kind === "name") { App.push(nameEditor()); return; }
          if (cur.kind === "done") { Store.save(); App.pop(); return; }
        }
        this.render();
      }
    };
  }

  // Friendly name entry: a real text field. On desktop just type; on the glasses,
  // tapping the field uses handwriting/voice when available. Falls back to the
  // D-pad speller for reliable on-glasses entry with no keyboard.
  function nameEditor() {
    var c = Store.character();
    function save(v) { c.name = formatName(v); Store.save(); App.pop(); }
    return {
      render: function () {
        App.el.innerHTML =
          '<div class="screen-title">Name</div>' +
          '<div class="screen-sub">Type a name, then Save</div>' +
          '<input id="name-input" class="text-input" type="text" maxlength="24" value="' + UI.esc(c.name) + '" />' +
          '<button id="name-save" class="btn">✓ Save</button>' +
          '<button id="name-speller" class="btn">A·B·C  D-pad speller</button>' +
          '<div class="note">On the glasses, tap the field to use handwriting or voice if enabled — otherwise use the D-pad speller.</div>';
        App.setHint("Type · Enter = Save · Esc = Back");
        var inp = document.getElementById("name-input");
        if (inp) {
          inp.focus();
          try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch (e) {}
          inp.addEventListener("keydown", function (e) {
            if (e.key === "Enter") { e.preventDefault(); save(inp.value); }
            else if (e.key === "Escape") { e.preventDefault(); App.pop(); }
          });
        }
        var sv = document.getElementById("name-save");
        if (sv) sv.addEventListener("click", function () { save(document.getElementById("name-input").value); });
        var sp = document.getElementById("name-speller");
        if (sp) sp.addEventListener("click", function () { App.replace(spellerEditor()); });
      },
      onKey: function (dir) { if (dir === "left") App.pop(); }
    };
  }

  // D-pad speller (arcade-style fallback): Up/Down cycle a letter, Left/Right move
  // the cursor, Select saves. Reliable on-glasses when there's no keyboard/IME.
  function spellerEditor() {
    var c = Store.character();
    var ALPHABET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'-";
    var chars = (c.name || "").split("");
    if (!chars.length) chars = ["A"];
    var pos = chars.length - 1;

    function cycle(ch, d) {
      var i = ALPHABET.indexOf(ch.toUpperCase());
      if (i < 0) i = 1;
      return ALPHABET[(i + d + ALPHABET.length) % ALPHABET.length];
    }

    return {
      render: function () {
        var slots = chars.map(function (ch, i) {
          var show = ch === " " ? "␣" : ch;
          return '<span class="ne-slot' + (i === pos ? " ne-cur" : "") + '">' + UI.esc(show) + "</span>";
        }).join("");
        App.el.innerHTML =
          '<div class="screen-title">Name</div>' +
          '<div class="screen-sub">Set each letter, then press ●</div>' +
          '<div class="ne">' + slots + "</div>" +
          '<div class="note">▲▼ change letter · ▶ next (adds a slot) · ◀ move back · ● done. Use ␣ to blank a slot.</div>';
        App.setHint("▲▼ Letter   ◀▶ Move   ● Done");
      },
      onKey: function (dir) {
        if (dir === "up") chars[pos] = cycle(chars[pos], 1);
        else if (dir === "down") chars[pos] = cycle(chars[pos], -1);
        else if (dir === "right") { pos++; if (pos >= chars.length) chars.push("A"); }
        else if (dir === "left") { if (pos > 0) pos--; }
        else if (dir === "select") {
          c.name = formatName(chars.join(""));
          Store.save(); App.pop(); return;
        }
        this.render();
      }
    };
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // Normalize a typed/spelled name: capitalize the first letter of each word,
  // the rest lowercase (e.g. "thorin OAKENSHIELD" -> "Thorin Oakenshield").
  function formatName(str) {
    var s = (str || "").replace(/\s+/g, " ").trim();
    if (!s) return "Adventurer";
    return s.split(" ").map(function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(" ");
  }

  // Pick which stats appear in the home HUD (up to 4). Selecting toggles; the
  // number shows the HUD slot order. When 4 are chosen, deselect one to swap.
  function toggleHud(key) {
    var hud = Store.character().hud;
    var i = hud.indexOf(key);
    if (i >= 0) hud.splice(i, 1);
    else if (hud.length < 4) hud.push(key);
    Store.save();
  }

  function hudPicker() {
    return ListScreen({
      title: "Home stats",
      sub: function () { return Store.character().hud.length + " / 4 chosen — ● to toggle"; },
      hint: "▲▼ Move   ● Toggle   ◀ Back",
      rows: function () {
        var hud = Store.character().hud;
        return Store.STAT_CATALOG.map(function (st) {
          var pos = hud.indexOf(st.key);
          return {
            main: st.label,
            meta: pos >= 0 ? "★ " + (pos + 1) : "",
            onSelect: function () { toggleHud(st.key); App.render(); }
          };
        });
      }
    });
  }

  return { view: view };
})();
