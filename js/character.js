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
        rows.push({ main: "Proficiency", meta: Store.fmt(c.proficiency) });
        rows.push({ main: "Initiative", meta: Store.fmt(Store.mod(c.abilities.dex)) });
        rows.push({ main: "Spell ability", meta: c.spellAbility.toUpperCase() });
        rows.push({ main: "Spell save DC", meta: String(Store.spellSaveDC()) });
        rows.push({ main: "Spell attack", meta: Store.fmt(Store.spellAttack()) });
        // Any row opens the editor.
        rows.forEach(function (r) { r.onSelect = function () { App.push(edit()); }; });
        rows.push({ main: "Edit character", onSelect: function () { App.push(edit()); } });
        return rows;
      }
    });
  }

  // Editor: Up/Down pick field, Left/Right adjust, Select = save & back.
  function edit() {
    var field = 0;
    // Build the list of editable fields as { label, get, adjust(delta) }.
    function fields() {
      var c = Store.character();
      var list = [
        { label: "Level", get: function () { return c.level; },
          adjust: function (d) { c.level = clamp(c.level + d, 1, 20); } }
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
          i = (i + d + SPELL_ABILITIES.length) % SPELL_ABILITIES.length;
          c.spellAbility = SPELL_ABILITIES[i];
        } });
      return list;
    }

    return {
      render: function () {
        var f = fields();
        var rows = f.map(function (x) { return { main: x.label, meta: String(x.get()) }; });
        App.el.innerHTML = UI.listHTML("Edit character", "Save DC " + Store.spellSaveDC(), rows, field);
        App.setHint("▲▼ Field   ◀▶ Adjust   ● Save");
        UI.scrollSelected();
      },
      onKey: function (dir) {
        var f = fields();
        if (dir === "up") field = (field - 1 + f.length) % f.length;
        else if (dir === "down") field = (field + 1) % f.length;
        else if (dir === "left") { f[field].adjust(-1); Store.save(); }
        else if (dir === "right") { f[field].adjust(1); Store.save(); }
        else if (dir === "select") { Store.save(); App.pop(); return; }
        this.render();
      }
    };
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  return { view: view };
})();
