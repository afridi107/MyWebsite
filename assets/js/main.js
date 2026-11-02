(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var toggleLabel = toggle ? toggle.querySelector(".sr-only") : null;

  /* ---------- Mobile navigation ---------- */
  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    if (toggleLabel) toggleLabel.textContent = open ? "Menü schließen" : "Menü öffnen";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setNav(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !header.contains(e.target)) setNav(false);
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal on scroll + active nav link ---------- */
  var revealTargets = document.querySelectorAll(
    ".section .split-text, .section .split-media, .coffee-panel, .product-card, .feature, .tile, .timeline li, .kontakt-info, .contact-form, .vision .container"
  );
  if ("IntersectionObserver" in window) {
    revealTargets.forEach(function (el) { el.classList.add("reveal"); });
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(function (el) { revealObs.observe(el); });

    var navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
    var linkFor = {};
    navLinks.forEach(function (a) { linkFor[a.getAttribute("href").slice(1)] = a; });
    // Detail blocks belong to "Produktwelt" in the navigation
    ["massagesessel", "kaffee", "kinderfahrgeschaefte", "snack-automaten"].forEach(function (id) {
      linkFor[id] = linkFor.produktwelt;
    });
    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var active = linkFor[entry.target.id];
        navLinks.forEach(function (a) {
          var on = a === active;
          a.classList.toggle("is-active", on);
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { sectionObs.observe(s); });
  }

  /* ---------- Contact form → mailto ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var TO = "info@jandforiginals.de";

  function fieldOf(input) { return input.closest(".field"); }

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = "form-status field--full" + (type ? " is-" + type : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var required = [
      document.getElementById("f-name"),
      document.getElementById("f-company"),
      document.getElementById("f-email")
    ];
    var consent = document.getElementById("f-consent");
    var firstInvalid = null;

    required.forEach(function (input) {
      var ok = input.value.trim() !== "" && input.checkValidity();
      fieldOf(input).classList.toggle("is-invalid", !ok);
      input.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstInvalid) firstInvalid = input;
    });
    var consentOk = consent.checked;
    fieldOf(consent).classList.toggle("is-invalid", !consentOk);
    consent.setAttribute("aria-invalid", String(!consentOk));
    if (!consentOk && !firstInvalid) firstInvalid = consent;

    if (firstInvalid) {
      setStatus("Bitte füllen Sie alle Pflichtfelder aus (gültige E-Mail-Adresse) und bestätigen Sie die Datenschutzerklärung.", "error");
      firstInvalid.focus();
      return;
    }

    var v = function (id) { return document.getElementById(id).value.trim(); };
    var interests = Array.prototype.slice
      .call(form.querySelectorAll('input[name="Interesse"]:checked'))
      .map(function (c) { return c.value; });

    var lines = [
      "Guten Tag,",
      "",
      "ich interessiere mich für eine Potenzialanalyse.",
      "",
      "Name: " + v("f-name"),
      "Unternehmen: " + v("f-company"),
      "E-Mail: " + v("f-email"),
      "Telefon: " + (v("f-phone") || "–"),
      "Art der Fläche: " + (v("f-area") || "–"),
      "Interesse: " + (interests.length ? interests.join(", ") : "–"),
      "",
      "Nachricht:",
      v("f-message") || "–",
      "",
      "Einwilligung Datenschutz: ja"
    ];

    var subject = "Anfrage Potenzialanalyse – " + v("f-company");
    var href = "mailto:" + TO +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\r\n"));

    window.location.href = href;
    setStatus("Vielen Dank! Ihr E-Mail-Programm sollte sich jetzt mit Ihrer Anfrage öffnen – bitte dort auf „Senden“ klicken. Falls nicht, schreiben Sie uns direkt an " + TO + ".", "success");
  });

  form.addEventListener("input", function (e) {
    var f = fieldOf(e.target);
    if (f && f.classList.contains("is-invalid")) {
      f.classList.remove("is-invalid");
      e.target.removeAttribute("aria-invalid");
    }
  });
  form.addEventListener("change", function (e) {
    if (e.target.id === "f-consent" && e.target.checked) fieldOf(e.target).classList.remove("is-invalid");
  });
})();
