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
        var rows = [
          { main: "▶ Next turn", onSelect: function () { nextTurn(); App.render(); } },
          { main: "+ Add combatant", onSelect: function () { App.push(addEditor()); } }
        ];
        order.forEach(function (c, i) {
          var active = (i === cb.active);
          rows.push({
            main: (active ? "▶ " : "   ") + c.name,
            meta: "init " + c.init,
            onSelect: (function (idx) {
              return function () { cb.active = idx; Store.save(); App.render(); };
            })(i)
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
