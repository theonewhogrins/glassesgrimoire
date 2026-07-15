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
        ac: 13,                         // armor class
        hp: { cur: 10, max: 10 },       // hit points
        hud: ["ac", "init", "dc", "atk"], // stat keys shown in the home HUD
        favorites: [],                  // array of spell names
        slots: { 1: { max: 2, used: 0 } } // per-level { max, used }
      },
      combat: { combatants: [], round: 1, active: 0 }
    };
  }

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      if (!(d && d.character)) return defaults();
      // Migrate older saved characters that predate these fields.
      if (!d.character.hp) d.character.hp = { cur: 10, max: 10 };
      if (d.character.ac == null) d.character.ac = 10;
      if (!d.character.hud) d.character.hud = ["ac", "init", "dc", "atk"];
      if (!d.combat) d.combat = { combatants: [], round: 1, active: 0 };
      return d;
    } catch (e) { return defaults(); }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  function mod(score) { return Math.floor((score - 10) / 2); }
  function fmt(n) { return (n >= 0 ? "+" : "") + n; }
  function amod(c, a) { return mod(c.abilities[a]); }

  // Catalog of stats that can be shown in the home HUD. Each val(c) is derived
  // live from the character, so the HUD always reflects current stats.
  var STAT_CATALOG = [
    { key: "ac", label: "AC", val: function (c) { return c.ac; } },
    { key: "init", label: "INIT", val: function (c) { return fmt(amod(c, "dex")); } },
    { key: "dc", label: "SPELL DC", val: function (c) { return 8 + c.proficiency + amod(c, c.spellAbility); } },
    { key: "atk", label: "SPELL ATK", val: function (c) { return fmt(c.proficiency + amod(c, c.spellAbility)); } },
    { key: "prof", label: "PROF", val: function (c) { return fmt(c.proficiency); } },
    { key: "pp", label: "PASSIVE PER", val: function (c) { return 10 + amod(c, "wis"); } },
    { key: "str", label: "STR", val: function (c) { return fmt(amod(c, "str")); } },
    { key: "dex", label: "DEX", val: function (c) { return fmt(amod(c, "dex")); } },
    { key: "con", label: "CON", val: function (c) { return fmt(amod(c, "con")); } },
    { key: "int", label: "INT", val: function (c) { return fmt(amod(c, "int")); } },
    { key: "wis", label: "WIS", val: function (c) { return fmt(amod(c, "wis")); } },
    { key: "cha", label: "CHA", val: function (c) { return fmt(amod(c, "cha")); } }
  ];

  return {
    data: function () { return data; },
    character: function () { return data.character; },
    combat: function () { return data.combat; },
    save: save,
    reset: function () { data = defaults(); save(); },

    // ---- helpers ----
    mod: mod,
    fmt: fmt,

    // ---- HUD stat catalog ----
    STAT_CATALOG: STAT_CATALOG,
    statByKey: function (key) {
      for (var i = 0; i < STAT_CATALOG.length; i++) if (STAT_CATALOG[i].key === key) return STAT_CATALOG[i];
      return null;
    },

    // Ensure a slot entry exists for a level, return it.
    slotFor: function (level) {
      var s = data.character.slots;
      if (!s[level]) s[level] = { max: 0, used: 0 };
      return s[level];
    },

    // Derived spellcasting numbers.
    spellMod: function () {
      var c = data.character;
      return mod(c.abilities[c.spellAbility]);
    },
    spellSaveDC: function () { return 8 + data.character.proficiency + this.spellMod(); },
    spellAttack: function () { return data.character.proficiency + this.spellMod(); }
  };
})();
