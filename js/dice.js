/*
 * Dice module — roll calculator that auto-applies modifiers.
 * Covers use case 1: "tell you the totals, accounting for modifiers."
 * Phase 1 is a manual roller (pick die/count/modifier -> total). The camera
 * "look at physical dice" reader is Phase 2 (camera access is gated on web apps).
 */
window.Dice = (function () {
  "use strict";
  var DICE = [4, 6, 8, 10, 12, 20, 100];
  var ABILITIES = [
    { key: null, name: "None" },
    { key: "str", name: "STR" }, { key: "dex", name: "DEX" }, { key: "con", name: "CON" },
    { key: "int", name: "INT" }, { key: "wis", name: "WIS" }, { key: "cha", name: "CHA" },
    { key: "spell", name: "Spell" }, { key: "prof", name: "Prof" }
  ];

  function abilityMod(a) {
    if (!a.key) return 0;
    if (a.key === "spell") return Store.spellMod();
    if (a.key === "prof") return Store.character().proficiency;
    return Store.mod(Store.character().abilities[a.key]);
  }

  function screen() {
    var s = { dieIdx: 5 /* d20 */, count: 1, mod: 0, abilIdx: 0, field: 0, result: null };

    function totalMod() { return s.mod + abilityMod(ABILITIES[s.abilIdx]); }

    function roll() {
      var die = DICE[s.dieIdx];
      var rolls = [];
      for (var i = 0; i < s.count; i++) rolls.push(1 + Math.floor(Math.random() * die));
      var sum = rolls.reduce(function (a, b) { return a + b; }, 0);
      var m = totalMod();
      s.result = { rolls: rolls, die: die, sum: sum, mod: m, total: sum + m };
    }

    function reducedMotion() {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    // Fun visual: rapidly cycle the number, then land on the real total with a bounce.
    function animate() {
      if (reducedMotion() || !s.result) return;
      var el = App.el.querySelector("#roll-total");
      if (!el) return;
      var maxFace = s.result.die * Math.max(1, s.count);
      var frames = 14, i = 0;
      el.classList.add("rolling");
      var timer = setInterval(function () {
        i++;
        el.textContent = String(1 + Math.floor(Math.random() * maxFace));
        if (i >= frames) {
          clearInterval(timer);
          el.textContent = String(s.result.total);
          el.classList.remove("rolling");
          el.classList.add("landed");
          setTimeout(function () { if (el) el.classList.remove("landed"); }, 450);
        }
      }, 55);
    }

    function fields() {
      return [
        { label: "Die", value: "d" + DICE[s.dieIdx] },
        { label: "Count", value: String(s.count) },
        { label: "Modifier", value: Store.fmt(s.mod) },
        { label: "Ability", value: ABILITIES[s.abilIdx].name +
            (ABILITIES[s.abilIdx].key ? " (" + Store.fmt(abilityMod(ABILITIES[s.abilIdx])) + ")" : "") },
        { label: "🎲 Roll", value: "" },
        { label: "◀ Back", value: "" }
      ];
    }

    return {
      render: function () {
        var f = fields();
        var rows = f.map(function (x) { return { main: x.label, meta: x.value }; });
        var sub = "Total mod " + Store.fmt(totalMod());
        var html = UI.listHTML("Dice", sub, rows, s.field);
        if (s.result) {
          var r = s.result;
          html += '<div class="result">';
          html += '<span class="roll-total" id="roll-total">' + r.total + "</span>";
          html += '<div class="roll-detail">' + s.count + "d" + r.die + " [" + r.rolls.join(", ") + "]" +
                  (r.mod ? " " + Store.fmt(r.mod) : "") + " = " + r.total + "</div>";
          html += "</div>";
        }
        App.el.innerHTML = html;
        App.setHint("▲▼ Field   ◀▶ Adjust   ● Roll/Select");
        UI.scrollSelected();
      },
      onKey: function (dir) {
        var n = 6;
        if (dir === "up") s.field = (s.field - 1 + n) % n;
        else if (dir === "down") s.field = (s.field + 1) % n;
        else if (dir === "left" || dir === "right") {
          var d = dir === "right" ? 1 : -1;
          if (s.field === 0) s.dieIdx = (s.dieIdx + d + DICE.length) % DICE.length;
          else if (s.field === 1) s.count = Math.max(1, Math.min(20, s.count + d));
          else if (s.field === 2) s.mod = Math.max(-10, Math.min(20, s.mod + d));
          else if (s.field === 3) s.abilIdx = (s.abilIdx + d + ABILITIES.length) % ABILITIES.length;
        } else if (dir === "select") {
          if (s.field === 4) { roll(); this.render(); animate(); return; }
          else if (s.field === 5) { App.pop(); return; }
        }
        this.render();
      }
    };
  }

  return { screen: screen };
})();
