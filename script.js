/* Sunrise Multispecialty Hospital — shared behaviour */
(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector(".burger");
  var navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      navLinks.classList.toggle("show");
      burger.setAttribute("aria-expanded", navLinks.classList.contains("show"));
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { navLinks.classList.remove("show"); });
    });
  }

  /* ---------- Search box ---------- */
  var searchToggle = document.querySelector(".search-toggle");
  var searchInput = document.querySelector(".search-box input");
  if (searchToggle && searchInput) {
    searchToggle.addEventListener("click", function () {
      searchInput.classList.toggle("open");
      if (searchInput.classList.contains("open")) searchInput.focus();
    });
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && searchInput.value.trim()) {
        window.location.href = "blog.html?q=" + encodeURIComponent(searchInput.value.trim());
      }
    });
  }

  /* ---------- Dark mode ---------- */
  var themeBtn = document.querySelector(".theme-toggle");
  var root = document.documentElement;
  var saved = localStorage.getItem("sunrise-theme");
  if (saved === "dark") root.setAttribute("data-theme", "dark");
  function refreshThemeIcon() {
    if (!themeBtn) return;
    themeBtn.innerHTML = root.getAttribute("data-theme") === "dark"
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  }
  refreshThemeIcon();
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) { root.removeAttribute("data-theme"); localStorage.setItem("sunrise-theme", "light"); }
      else { root.setAttribute("data-theme", "dark"); localStorage.setItem("sunrise-theme", "dark"); }
      refreshThemeIcon();
    });
  }

  /* ---------- Language toggle (EN / TE) ---------- */
  var langButtons = document.querySelectorAll(".lang-toggle button");
  var savedLang = localStorage.getItem("sunrise-lang") || "en";
  function applyLang(lang) {
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var text = el.getAttribute("data-" + lang) || el.getAttribute("data-en");
      el.textContent = text;
    });
    document.querySelectorAll("[data-en-html]").forEach(function (el) {
      var html = el.getAttribute("data-" + lang + "-html") || el.getAttribute("data-en-html");
      el.innerHTML = html;
    });
    langButtons.forEach(function (b) { b.classList.toggle("active", b.dataset.lang === lang); });
    document.documentElement.setAttribute("lang", lang === "te" ? "te" : "en");
  }
  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      localStorage.setItem("sunrise-lang", btn.dataset.lang);
      applyLang(btn.dataset.lang);
    });
  });
  applyLang(savedLang);

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Gallery filter ---------- */
  var filterBtns = document.querySelectorAll(".gallery-filter button");
  var galleryItems = document.querySelectorAll(".gallery-item");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var cat = btn.dataset.filter;
      galleryItems.forEach(function (item) {
        item.style.display = (cat === "all" || item.dataset.cat === cat) ? "" : "none";
      });
    });
  });

  /* ---------- Back to top ---------- */
  var topBtn = document.querySelector(".fab.top");
  if (topBtn) {
    window.addEventListener("scroll", function () {
      topBtn.style.display = window.scrollY > 500 ? "flex" : "none";
    });
    topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------- Generic form success handler (demo-mode) ---------- */
  document.querySelectorAll("form[data-demo-submit]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var successBox = form.parentElement.querySelector(".form-success") || form.querySelector(".form-success");
      if (successBox) {
        successBox.classList.add("show");
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  });

  /* ---------- Doctor filter on Doctors page ---------- */
  var deptFilter = document.querySelector("#doctorDeptFilter");
  var doctorCards = document.querySelectorAll("[data-dept]");
  if (deptFilter) {
    deptFilter.addEventListener("change", function () {
      var val = deptFilter.value;
      doctorCards.forEach(function (card) {
        card.style.display = (val === "all" || card.dataset.dept === val) ? "" : "none";
      });
    });
  }

  /* ---------- Appointment doctor list depends on department ---------- */
  var apptDept = document.querySelector("#apptDepartment");
  var apptDoctor = document.querySelector("#apptDoctor");
  var doctorMap = {
    cardiology: ["Dr. Ashwin Rao — Senior Cardiologist", "Dr. Meera Iyer — Interventional Cardiologist"],
    orthopedics: ["Dr. Kiran Kumar — Joint Replacement Surgeon", "Dr. Sana Fatima — Sports Injury Specialist"],
    gynecology: ["Dr. Lakshmi Prasanna — Senior Gynecologist", "Dr. Ritu Sharma — High-Risk Pregnancy Specialist"],
    pediatrics: ["Dr. Arjun Menon — Senior Pediatrician", "Dr. Divya Reddy — Neonatologist"],
    neurology: ["Dr. Rahul Varma — Consultant Neurologist"],
    ent: ["Dr. Farha Khan — ENT & Head-Neck Surgeon"],
    dermatology: ["Dr. Neha Kapoor — Cosmetic Dermatologist"],
    dentistry: ["Dr. Vivek Chandra — Oral & Maxillofacial Surgeon"],
    general: ["Dr. Suresh Naidu — General Physician"]
  };
  if (apptDept && apptDoctor) {
    apptDept.addEventListener("change", function () {
      var list = doctorMap[apptDept.value] || [];
      apptDoctor.innerHTML = '<option value="">Select doctor</option>' +
        list.map(function (d) { return '<option>' + d + '</option>'; }).join("");
    });
  }

  /* ---------- Set active nav link ---------- */
  var here = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });

  /* ---------- Year in footer ---------- */
  var yearEl = document.querySelector("#currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
