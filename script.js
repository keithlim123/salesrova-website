/* SalesRova — lightweight interactions and accessible form validation */
(function () {
  "use strict";

  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");

  function closeNavigation() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("nav-open");
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
      nav.classList.toggle("is-open", willOpen);
      navToggle.setAttribute("aria-expanded", String(willOpen));
      navToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
      document.body.classList.toggle("nav-open", willOpen);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNavigation();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNavigation();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeNavigation();
    });
  }

  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelectorAll("[data-year]").forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  } else {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

    revealItems.forEach(function (item) { observer.observe(item); });
  }

  const form = document.querySelector("[data-consultation-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const serviceGroup = form.querySelector("[data-service-group]");
  const serviceInputs = Array.from(form.querySelectorAll('input[name="service[]"]'));
  const contactInputs = Array.from(form.querySelectorAll('input[name="preferred-contact"]'));
  const contactGroup = contactInputs.length ? contactInputs[0].closest("fieldset") : null;

  function groupIsChecked(inputs) {
    return inputs.some(function (input) { return input.checked; });
  }

  function updateGroupValidity(inputs, group, message) {
    if (!inputs.length) return true;
    const isValid = groupIsChecked(inputs);
    inputs[0].setCustomValidity(isValid ? "" : message);
    if (group) group.classList.toggle("has-error", !isValid && form.classList.contains("was-validated"));
    return isValid;
  }

  serviceInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      updateGroupValidity(serviceInputs, serviceGroup, "Choose at least one service.");
    });
  });

  contactInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      updateGroupValidity(contactInputs, contactGroup, "Choose a preferred contact method.");
    });
  });

  form.querySelectorAll("input, select, textarea").forEach(function (control) {
    control.addEventListener("input", function () {
      if (status) status.textContent = "";
    });
  });

  document.querySelectorAll("[data-service-link]").forEach(function (link) {
    link.addEventListener("click", function () {
      const service = link.getAttribute("data-service-link");
      const matchingInput = serviceInputs.find(function (input) { return input.value === service; });
      if (matchingInput) {
        matchingInput.checked = true;
        updateGroupValidity(serviceInputs, serviceGroup, "Choose at least one service.");
      }
    });
  });

  form.addEventListener("submit", function (event) {
    form.classList.add("was-validated");
    updateGroupValidity(serviceInputs, serviceGroup, "Choose at least one service.");
    updateGroupValidity(contactInputs, contactGroup, "Choose a preferred contact method.");

    if (!form.checkValidity()) {
      event.preventDefault();
      if (status) status.textContent = "Please review the highlighted fields before submitting.";
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (status) status.textContent = "Sending your enquiry…";
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
    }
  });
})();

