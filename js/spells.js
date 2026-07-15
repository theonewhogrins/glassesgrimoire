/*
 * Spells module — browse, favorites, spell-slot tracker, and letter search.
 * Voice search is intentionally deferred to Phase 2 (dictation is gated on the
 * MRBD web-app surface); the letter search below is the D-pad v1 equivalent.
 */
window.Spells = (function () {
  "use strict";
  var SPELLS = window.SPELLS || [];

  function levelLabel(n) { return n === 0 ? "Cantrip" : "Level " + n; }

  var CLASSES = (function () {
    var set = {};
    SPELLS.forEach(function (s) { s.classes.forEach(function (c) { set[c] = true; }); });
    return Object.keys(set).sort();
  })();

  function levelsForClass(cls) {
    var set = {};
    SPELLS.forEach(function (s) { if (s.classes.indexOf(cls) !== -1) set[s.level] = true; });
    return Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
  }

  function spellsFor(cls, level) {
    return SPELLS.filter(function (s) {
      return s.classes.indexOf(cls) !== -1 && s.level === level;
    }).sort(byName);
  }

  function byName(a, b) { return a.name.localeCompare(b.name); }

  function isFav(name) { return Store.character().favorites.indexOf(name) !== -1; }

  function toggleFav(name) {
    var f = Store.character().favorites;
    var i = f.indexOf(name);
    if (i === -1) f.push(name); else f.splice(i, 1);
    Store.save();
  }

  function favSpells() {
    return Store.character().favorites
      .map(function (n) { return SPELLS.filter(function (s) { return s.name === n; })[0]; })
      .filter(Boolean).sort(byName);
  }

  // ---- Menu -----------------------------------------------------------------
  function menu() {
    return ListScreen({
      title: "Spells",
      sub: "Choose a view",
      rows: function () {
        return [
          { main: "Browse by class", onSelect: function () { App.push(classScreen()); } },
          { main: "★ Favorites", meta: String(favSpells().length), onSelect: function () { App.push(favorites()); } },
          { main: "Spell slots", onSelect: function () { App.push(slots()); } },
          { main: "Find by letter", onSelect: function () { App.push(letterPicker()); } }
        ];
      }
    });
  }

  // ---- Browse: class -> level -> list -> detail -----------------------------
  function classScreen() {
    return ListScreen({
      title: "Browse", sub: "Choose a class",
      rows: function () {
        return CLASSES.map(function (c) {
          return { main: c, onSelect: function () { App.push(levelScreen(c)); } };
        });
      }
    });
  }

  function levelScreen(cls) {
    return ListScreen({
      title: cls, sub: "Choose a spell level",
      rows: function () {
        return levelsForClass(cls).map(function (l) {
          var n = spellsFor(cls, l).length;
          return {
            main: levelLabel(l), meta: n + (n === 1 ? " spell" : " spells"),
            onSelect: function () { App.push(listScreen(cls, l)); }
          };
        });
      }
    });
  }

  function listScreen(cls, level) {
    return ListScreen({
      title: levelLabel(level), sub: cls,
      hint: "▲▼ Move   ● Open   ◀ Back",
      rows: function () {
        return spellsFor(cls, level).map(function (s) {
          return {
            main: (isFav(s.name) ? "★ " : "") + s.name, meta: s.school,
            onSelect: function () { App.push(detail(s)); }
          };
        });
      }
    });
  }

  // ---- Detail (viewer: Up/Down scroll, Right = fav, Left/Select = back) ------
  function cardHTML(s) {
    var conc = /Conc\./.test(s.duration);
    var html = "<h1>" + UI.esc(s.name) + (isFav(s.name) ? " ★" : "") + "</h1>";
    html += '<div class="school">' + levelLabel(s.level) + " · " + UI.esc(s.school) +
            (conc ? " · Concentration" : "") + "</div>";
    html += "<dl>";
    html += "<dt>Cast</dt><dd>" + UI.esc(s.cast) + "</dd>";
    html += "<dt>Range</dt><dd>" + UI.esc(s.range) + "</dd>";
    html += "<dt>Comp.</dt><dd>" + UI.esc(s.components) + "</dd>";
    html += "<dt>Dur.</dt><dd>" + UI.esc(s.duration) + "</dd>";
    html += "</dl>";
    html += '<div class="desc">' + UI.esc(s.desc) + "</div>";
    return html;
  }

  function detail(s) {
    return {
      render: function () {
        App.el.innerHTML = '<div class="detail" id="detail" tabindex="0">' + cardHTML(s) + "</div>";
        App.setHint("▲▼ Scroll   ▶ " + (isFav(s.name) ? "★ Unfav" : "☆ Fav") + "   ◀ Back");
      },
      onKey: function (dir) {
        var d = document.getElementById("detail");
        if (dir === "up") { if (d) d.scrollTop -= 60; }
        else if (dir === "down") { if (d) d.scrollTop += 60; }
        else if (dir === "right") { toggleFav(s.name); this.render(); }
        else if (dir === "left" || dir === "select") { App.pop(); }
      }
    };
  }

  // ---- Favorites carousel (flip with Left/Right) ----------------------------
  function favorites() {
    var i = 0;
    return {
      render: function () {
        var favs = favSpells();
        if (!favs.length) {
          App.el.innerHTML = '<div class="screen-title">★ Favorites</div>' +
            '<div class="note">No favorites yet.<br>Open a spell and press ▶ to add it.</div>';
          App.setHint("◀ Back");
          return;
        }
        if (i >= favs.length) i = favs.length - 1;
        var s = favs[i];
        App.el.innerHTML = '<div class="detail" id="detail" tabindex="0">' + cardHTML(s) +
          '<div class="roll-detail">' + (i + 1) + " / " + favs.length + "</div></div>";
        App.setHint("◀▶ Flip   ▲ Unfav   ● Done");
      },
      onKey: function (dir) {
        var favs = favSpells();
        if (!favs.length) { if (dir === "left" || dir === "select") App.pop(); return; }
        if (dir === "left") { i = (i - 1 + favs.length) % favs.length; this.render(); }
        else if (dir === "right") { i = (i + 1) % favs.length; this.render(); }
        else if (dir === "up") { toggleFav(favs[i].name); if (i > 0) i--; this.render(); }
        else if (dir === "select") { App.pop(); }
      }
    };
  }

  // ---- Spell-slot tracker ---------------------------------------------------
  function slots() {
    return ListScreen({
      title: "Spell slots",
      sub: "Track expended slots",
      hint: "▲▼ Level   ● Edit   ◀ Back",
      rows: function () {
        var rows = [];
        for (var lvl = 1; lvl <= 9; lvl++) {
          var s = Store.slotFor(lvl);
          if (s.max === 0 && lvl > 3) continue; // hide empty high levels to reduce clutter
          rows.push({
            main: "Level " + lvl, meta: s.used + " / " + s.max,
            onSelect: (function (L) { return function () { App.push(slotEditor(L)); }; })(lvl)
          });
        }
        rows.push({ main: "Long rest (reset used)", onSelect: function () {
          for (var L = 1; L <= 9; L++) Store.slotFor(L).used = 0; Store.save(); App.render();
        } });
        return rows;
      }
    });
  }

  function slotEditor(level) {
    var field = 0; // 0 = Max, 1 = Used
    return {
      render: function () {
        var s = Store.slotFor(level);
        App.el.innerHTML = UI.listHTML("Level " + level + " slots", "Adjust with ◀ ▶",
          [{ main: "Max slots", meta: String(s.max) },
           { main: "Used", meta: String(s.used) }], field);
        App.setHint("▲▼ Field   ◀▶ Adjust   ● Done");
        UI.scrollSelected();
      },
      onKey: function (dir) {
        var s = Store.slotFor(level);
        if (dir === "up") field = 0;
        else if (dir === "down") field = 1;
        else if (dir === "left" || dir === "right") {
          var d = dir === "right" ? 1 : -1;
          if (field === 0) s.max = Math.max(0, Math.min(9, s.max + d));
          else s.used = Math.max(0, Math.min(s.max, s.used + d));
          Store.save();
        } else if (dir === "select") { App.pop(); return; }
        this.render();
      }
    };
  }

  // ---- Letter search --------------------------------------------------------
  function letterPicker() {
    var letters = {};
    SPELLS.forEach(function (s) { letters[s.name.charAt(0).toUpperCase()] = true; });
    var keys = Object.keys(letters).sort();
    return ListScreen({
      title: "Find by letter", sub: "Pick a starting letter",
      rows: function () {
        return keys.map(function (ch) {
          var n = SPELLS.filter(function (s) { return s.name.charAt(0).toUpperCase() === ch; }).length;
          return { main: ch, meta: n + "", onSelect: function () { App.push(letterResults(ch)); } };
        });
      }
    });
  }

  function letterResults(ch) {
    return ListScreen({
      title: '"' + ch + '"', sub: "Matching spells",
      hint: "▲▼ Move   ● Open   ◀ Back",
      rows: function () {
        return SPELLS.filter(function (s) { return s.name.charAt(0).toUpperCase() === ch; })
          .sort(byName).map(function (s) {
            return { main: s.name, meta: levelLabel(s.level), onSelect: function () { App.push(detail(s)); } };
          });
      }
    });
  }

  return { menu: menu };
})();
