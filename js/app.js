/*
 * Boot — the home hub + global D-pad input wiring.
 * Load order (see index.html): data -> store -> ui -> modules -> app.
 */
(function () {
  "use strict";

  function hub() {
    return ListScreen({
      title: "Grimoire",
      sub: function () {
        var c = Store.character();
        return c.name + " · " + c.cls + " " + c.level;
      },
      hint: "▲▼ Move   ● Open",
      onBack: function () { /* top level — nowhere to go back to */ },
      rows: function () {
        return [
          { main: "Character", meta: "modifiers", onSelect: function () { App.push(Character.view()); } },
          { main: "Spells", meta: "browse · ★ · slots", onSelect: function () { App.push(Spells.menu()); } },
          { main: "Combat", meta: "initiative", onSelect: function () { App.push(Combat.screen()); } },
          { main: "Dice", meta: "roll + mods", onSelect: function () { App.push(Dice.screen()); } }
        ];
      }
    });
  }

  // Map physical keys -> logical D-pad directions. On MRBD the D-pad and the
  // Neural Band click arrive as these same key events.
  function toDir(key) {
    switch (key) {
      case "ArrowUp": return "up";
      case "ArrowDown": return "down";
      case "ArrowLeft": return "left";
      case "ArrowRight": return "right";
      case "Enter": case " ": return "select";
      case "Backspace": return "left";
      default: return null;
    }
  }

  window.addEventListener("keydown", function (e) {
    var dir = toDir(e.key);
    if (!dir) return;
    e.preventDefault();
    App.key(dir);
  });

  // Desktop click support (glasses use the D-pad / Neural Band).
  App.el.addEventListener("click", function (e) {
    var row = e.target.closest(".row");
    if (row) App.click(Number(row.getAttribute("data-i")));
  });

  // Boot.
  if (!window.SPELLS || !window.SPELLS.length) {
    App.el.innerHTML = '<div class="screen-title">No spells loaded</div>' +
      '<div class="note">Check that data/spells.js loaded.</div>';
    return;
  }
  App.start(hub());
})();
