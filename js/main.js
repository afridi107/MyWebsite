(function () {
  "use strict";


  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  const links = document.querySelectorAll(".nav-link");

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile menu
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("open", open);
  }
  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  links.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
  document.addEventListener("click", (e) => {
    if (menu.classList.contains("open") && !header.contains(e.target)) setMenu(false);
  });

  // Header border on scroll
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active nav link + reveal animations
  if ("IntersectionObserver" in window) {
    const sections = document.querySelectorAll("main section[id]");
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) =>
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => sectionObserver.observe(s));

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }

  // Contact form: validate, then open the visitor's email client
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const EMAIL_TO = "your.email@example.com";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    ["name", "email", "message"].forEach((id) => {
      const input = document.getElementById(id);
      const ok = input.value.trim() !== "" && input.checkValidity();
      input.closest(".field").classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      status.textContent = "Please fill in all fields with a valid email address.";
      status.className = "form-status full error";
      return;
    }

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const subject = encodeURIComponent("Website message from " + name);
    const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");

    window.location.href = "mailto:" + EMAIL_TO + "?subject=" + subject + "&body=" + body;
    status.textContent = "Thanks! Your email app should open so you can send the message.";
    status.className = "form-status full success";
    form.reset();
  });
})();
