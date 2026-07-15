/*
 * UI core — the App screen stack + shared rendering helpers.
 *
 * A "screen" is any object with:
 *   render()        -> paints into App.el and sets the footer hint
 *   onKey(dir)      -> handles a logical D-pad key: up|down|left|right|select
 *   clickRow(i)     -> (optional) desktop click support
 *
 * Two screen conventions (keep hints consistent with these):
 *   Navigator — Up/Down move, Select/Right drill in, Left = back.
 *   Editor    — Up/Down pick field, Left/Right adjust value, Select = done.
 */
window.UI = (function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Render a title + optional subtitle + a selectable list. `rows` items:
  //   { main, meta } — meta is the right-aligned value (optional).
  function listHTML(title, sub, rows, index) {
    var html = '<div class="screen-title">' + esc(title) + "</div>";
    if (sub) html += '<div class="screen-sub">' + esc(sub) + "</div>";
    html += '<div class="list" id="list">';
    rows.forEach(function (r, i) {
      // tabindex makes rows real focusable elements (D-pad QA check + real focus).
      html += '<div class="row' + (i === index ? " selected" : "") + '" data-i="' + i + '" tabindex="0">';
      html += '<span class="row-main">' + esc(r.main) + "</span>";
      if (r.meta != null && r.meta !== "") html += '<span class="row-meta">' + esc(r.meta) + "</span>";
      html += "</div>";
    });
    html += "</div>";
    return html;
  }

  // Scroll the currently-selected row into view (used by list + editor screens).
  function scrollSelected() {
    var app = document.getElementById("app");
    var sel = app && app.querySelector(".row.selected");
    if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: "nearest" });
  }

  return { esc: esc, listHTML: listHTML, scrollSelected: scrollSelected };
})();

// ---- App: the screen stack + input dispatch --------------------------------
window.App = (function () {
  "use strict";
  var stack = [];
  var el = document.getElementById("app");
  var hintEl = document.getElementById("hint");

  function top() { return stack[stack.length - 1]; }
  function render() { if (top()) top().render(); }

  return {
    el: el,
    setHint: function (t) { hintEl.textContent = t; },
    push: function (s) { stack.push(s); render(); },
    pop: function () { if (stack.length > 1) { stack.pop(); render(); } },
    replace: function (s) { stack[stack.length - 1] = s; render(); },
    start: function (s) { stack = [s]; render(); },
    render: render,
    key: function (dir) { var t = top(); if (t && t.onKey) t.onKey(dir); },
    click: function (i) { var t = top(); if (t && t.clickRow) t.clickRow(i); }
  };
})();

/*
 * ListScreen — the reusable "navigator" screen.
 *   opts.title / opts.sub : string or () => string
 *   opts.rows             : () => [{ main, meta, onSelect(i) }]
 *   opts.hint             : footer hint (optional)
 *   opts.onBack           : called on Left (defaults to App.pop)
 */
window.ListScreen = function (opts) {
  "use strict";
  var idx = opts.startIndex || 0;

  function back() { if (opts.onBack) opts.onBack(); else App.pop(); }
  function val(x) { return typeof x === "function" ? x() : x; }

  return {
    setIndex: function (i) { idx = i; },
    render: function () {
      var rows = opts.rows();
      if (idx >= rows.length) idx = Math.max(0, rows.length - 1);
      App.el.innerHTML = UI.listHTML(val(opts.title), val(opts.sub), rows, idx);
      App.setHint(opts.hint || "▲▼ Move   ● Select   ◀ Back");
      var sel = App.el.querySelector(".row.selected");
      if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: "nearest" });
    },
    onKey: function (dir) {
      var rows = opts.rows();
      if (!rows.length) { if (dir === "left") back(); return; }
      if (dir === "up") { idx = (idx - 1 + rows.length) % rows.length; this.render(); }
      else if (dir === "down") { idx = (idx + 1) % rows.length; this.render(); }
      else if (dir === "select" || dir === "right") { if (rows[idx].onSelect) rows[idx].onSelect(idx); }
      else if (dir === "left") { back(); }
    },
    clickRow: function (i) {
      var rows = opts.rows();
      idx = i; this.render();
      if (rows[i] && rows[i].onSelect) rows[i].onSelect(i);
    }
  };
};
