/*
 * Boot — the home hub + global D-pad input wiring.
 * Load order (see index.html): data -> store -> ui -> modules -> app.
 */
(function () {
  "use strict";

  // Home hub: a glanceable stats banner on top + the module menu. It's a custom
  // screen (not a ListScreen) so it can show the banner and let Left/Right adjust
  // HP directly from home (the most-used in-play action).
  function hub() {
    var idx = 0;
    var MODULES = [
      { main: "Character", meta: "stats & name", open: function () { App.push(Character.view()); } },
      { main: "Spells", meta: "browse · ★ · slots", open: function () { App.push(Spells.menu()); } },
      { main: "Combat", meta: "initiative", open: function () { App.push(Combat.screen()); } },
      { main: "Dice", meta: "roll + mods", open: function () { App.push(Dice.screen()); } }
    ];

    function cell(k, v) {
      return '<div class="hud-cell"><div class="hud-k">' + k + '</div>' +
             '<div class="hud-v">' + UI.esc(String(v)) + "</div></div>";
    }

    function bannerHTML() {
      var c = Store.character();
      var hp = c.hp || { cur: 0, max: 0 };
      var low = hp.max > 0 && hp.cur <= hp.max * 0.25;
      var cells = (c.hud || []).map(function (key) {
        var st = Store.statByKey(key);
        return st ? cell(st.label, st.val(c)) : "";
      }).join("");
      return '<div class="hud">' +
        '<div class="hud-hp' + (low ? " low" : "") + '">&#9829; <b>' + hp.cur + "</b> / " + hp.max + " HP</div>" +
        '<div class="hud-grid">' + cells + "</div></div>";
    }

    return {
      render: function () {
        var c = Store.character();
        var rows = MODULES.map(function (m, i) {
          return '<div class="row' + (i === idx ? " selected" : "") + '" data-i="' + i + '" tabindex="0">' +
            '<span class="row-main">' + UI.esc(m.main) + '</span>' +
            '<span class="row-meta">' + UI.esc(m.meta) + "</span></div>";
        }).join("");
        App.el.innerHTML =
          '<div class="screen-title">Grimoire</div>' +
          '<div class="screen-sub">' + UI.esc(c.name + " · " + c.cls + " " + c.level) + "</div>" +
          bannerHTML() +
          '<div class="list" id="list">' + rows + "</div>";
        App.setHint("▲▼ Menu   ◀▶ HP −/+   ● Open");
        UI.scrollSelected();
      },
      onKey: function (dir) {
        if (dir === "up") { idx = (idx - 1 + MODULES.length) % MODULES.length; this.render(); }
        else if (dir === "down") { idx = (idx + 1) % MODULES.length; this.render(); }
        else if (dir === "select") { MODULES[idx].open(); }
        else if (dir === "left" || dir === "right") {
          var c = Store.character();
          if (!c.hp) c.hp = { cur: 0, max: 0 };
          c.hp.cur = Math.max(0, Math.min(c.hp.max, c.hp.cur + (dir === "right" ? 1 : -1)));
          Store.save(); this.render();
        }
      },
      clickRow: function (i) { idx = i; this.render(); MODULES[i].open(); }
    };
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
    // When typing in a text field, let the field handle keys (don't hijack D-pad).
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
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
