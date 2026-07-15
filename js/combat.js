/*
 * Combat module — initiative order tracker ("see the character order in combat").
 * Scope: your character plus other combatants you add; combatants sort by
 * initiative (desc). "Next turn" steps the active marker and advances the round.
 */
window.Combat = (function () {
  "use strict";
  var PRESETS = ["Me", "Ally", "Enemy", "NPC"];

  function sorted() {
    // Stable sort by initiative desc.
    return Store.combat().combatants
      .map(function (c, i) { return { c: c, i: i }; })
      .sort(function (a, b) { return b.c.init - a.c.init || a.i - b.i; })
      .map(function (x) { return x.c; });
  }

  function screen() {
    return ListScreen({
      title: "Combat",
      sub: function () { return "Round " + Store.combat().round; },
      hint: "▲▼ Move   ● Select   ◀ Back",
      rows: function () {
        var cb = Store.combat();
        var order = sorted();
        // Auto-number duplicate labels (Enemy 1, Enemy 2, ...) by insertion order.
        // Names that appear only once stay unnumbered.
        var counts = {};
        cb.combatants.forEach(function (c) { counts[c.name] = (counts[c.name] || 0) + 1; });
        var running = {};
        var labels = cb.combatants.map(function (c) {
          running[c.name] = (running[c.name] || 0) + 1;
          return counts[c.name] > 1 ? c.name + " " + running[c.name] : c.name;
        });
        var rows = [
          { main: "▶ Next turn", onSelect: function () { nextTurn(); App.render(); } },
          { main: "+ Add combatant", onSelect: function () { App.push(addEditor()); } }
        ];
        order.forEach(function (c, i) {
          var active = (i === cb.active);
          var label = labels[cb.combatants.indexOf(c)];
          rows.push({
            main: (active ? "▶ " : "   ") + label,
            meta: "init " + c.init,
            onSelect: (function (combatant, lbl) {
              return function () { App.push(combatantMenu(combatant, lbl)); };
            })(c, label)
          });
        });
        if (order.length) {
          rows.push({ main: "Clear all", onSelect: function () {
            cb.combatants = []; cb.active = 0; cb.round = 1; Store.save(); App.render();
          } });
        }
        return rows;
      }
    });
  }

  // Per-combatant actions: make active, or remove (which triggers auto-renumber).
  function combatantMenu(c, label) {
    return ListScreen({
      title: label,
      sub: "init " + c.init,
      hint: "▲▼ Move   ● Select   ◀ Back",
      rows: function () {
        return [
          { main: "Set as active turn", onSelect: function () {
            var cb = Store.combat();
            cb.active = sorted().indexOf(c);
            Store.save(); App.pop();
          } },
          { main: "Remove", onSelect: function () {
            var cb = Store.combat();
            var i = cb.combatants.indexOf(c);
            if (i >= 0) cb.combatants.splice(i, 1);
            if (cb.active >= cb.combatants.length) cb.active = 0;
            Store.save(); App.pop();
          } },
          { main: "Cancel", onSelect: function () { App.pop(); } }
        ];
      }
    });
  }

  function nextTurn() {
    var cb = Store.combat();
    var n = cb.combatants.length;
    if (!n) return;
    cb.active = cb.active + 1;
    if (cb.active >= n) { cb.active = 0; cb.round += 1; } // wrapped -> new round
    Store.save();
  }

  // Add editor: Up/Down pick field, Left/Right adjust, Select on Add/Back acts.
  function addEditor() {
    var draft = { nameIdx: 0, init: 10 };
    var field = 0; // 0 Name, 1 Initiative, 2 Add, 3 Back
    return {
      render: function () {
        var rows = [
          { main: "Name", meta: PRESETS[draft.nameIdx] },
          { main: "Initiative", meta: String(draft.init) },
          { main: "✓ Add to combat", meta: "" },
          { main: "◀ Cancel", meta: "" }
        ];
        App.el.innerHTML = UI.listHTML("Add combatant", "◀▶ to change", rows, field);
        App.setHint("▲▼ Field   ◀▶ Adjust   ● Select");
        UI.scrollSelected();
      },
      onKey: function (dir) {
        if (dir === "up") field = (field + 3) % 4;
        else if (dir === "down") field = (field + 1) % 4;
        else if (dir === "left" || dir === "right") {
          var d = dir === "right" ? 1 : -1;
          if (field === 0) draft.nameIdx = (draft.nameIdx + d + PRESETS.length) % PRESETS.length;
          else if (field === 1) draft.init = Math.max(0, Math.min(30, draft.init + d));
        } else if (dir === "select") {
          if (field === 2) {
            Store.combat().combatants.push({ name: PRESETS[draft.nameIdx], init: draft.init });
            Store.save(); App.pop(); return;
          } else if (field === 3) { App.pop(); return; }
        }
        this.render();
      }
    };
  }

  return { screen: screen };
})();
