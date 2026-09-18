/* Runs synchronously in <head> before the body paints, so the correct
   theme is applied with no flash of the wrong colors.
   Kept tiny and dependency-free; all storage access is guarded. */
(function () {
  "use strict";
  var root = document.documentElement;
  try {
    var theme = localStorage.getItem("sprout-theme");
    if (theme !== "dark" && theme !== "light") {
      theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    root.setAttribute("data-theme", theme);

    var lang = localStorage.getItem("sprout-lang");
    if (lang === "th" || lang === "en") root.setAttribute("lang", lang);
  } catch (e) {
    root.setAttribute("data-theme", "light");
  }
})();
