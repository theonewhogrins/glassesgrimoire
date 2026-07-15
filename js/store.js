/*
 * Store — persistent character + combat state (localStorage).
 * One JSON blob under "grimoire.v1". All modules read/write through here.
 */
window.Store = (function () {
  "use strict";
  var KEY = "grimoire.v1";
  var data = load();

  function defaults() {
    return {
      character: {
        name: "Adventurer",
        cls: "Wizard",
        level: 1,
        abilities: { str: 10, dex: 14, con: 12, int: 16, wis: 12, cha: 10 },
        proficiency: 2,
        spellAbility: "int",           // int | wis | cha
        favorites: [],                  // array of spell names
        slots: { 1: { max: 2, used: 0 } } // per-level { max, used }
      },
      combat: { combatants: [], round: 1, active: 0 }
    };
  }

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      return d && d.character ? d : defaults();
    } catch (e) { return defaults(); }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  return {
    data: function () { return data; },
    character: function () { return data.character; },
    combat: function () { return data.combat; },
    save: save,
    reset: function () { data = defaults(); save(); },

    // ---- helpers ----
    mod: function (score) { return Math.floor((score - 10) / 2); },
    fmt: function (n) { return (n >= 0 ? "+" : "") + n; },

    // Ensure a slot entry exists for a level, return it.
    slotFor: function (level) {
      var s = data.character.slots;
      if (!s[level]) s[level] = { max: 0, used: 0 };
      return s[level];
    },

    // Derived spellcasting numbers.
    spellMod: function () {
      var c = data.character;
      return this.mod(c.abilities[c.spellAbility]);
    },
    spellSaveDC: function () { return 8 + data.character.proficiency + this.spellMod(); },
    spellAttack: function () { return data.character.proficiency + this.spellMod(); }
  };
})();
