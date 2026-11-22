/* ============================================================
   令敏科技官网 - 交互脚本
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var header = document.getElementById("siteHeader");
  var backTop = document.getElementById("backTop");

  /* ---------- 滚动：导航变色 + 返回顶部 ---------- */
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("scrolled", y > 40);
    backTop.classList.toggle("show", y > 500);
    scrollSpy(y);
  }

  /* ---------- 导航高亮（scroll spy）---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav a[href^='#']"));
  var sections = navLinks
    .map(function (a) {
      var el = document.querySelector(a.getAttribute("href"));
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  function scrollSpy(y) {
    var pos = y + window.innerHeight * 0.32;
    var current = null;
    sections.forEach(function (s) {
      if (s.el.offsetTop <= pos) current = s;
    });
    if (!current && sections.length) current = sections[0];
    navLinks.forEach(function (a) {
      a.classList.toggle("active", current && a === current.link);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端汉堡菜单 ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");

  function closeNav() {
    nav.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });

  // 点击抽屉外部关闭
  document.addEventListener("click", function (e) {
    if (!nav.classList.contains("open")) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    closeNav();
  });

  /* ---------- 滚动入场动画 ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 案例按行业筛选 ---------- */
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll("#caseFilter .filter-btn"));
  var caseCards = Array.prototype.slice.call(document.querySelectorAll("#casesGrid .case-card"));
  var caseEmpty = document.getElementById("caseEmpty");

  if (filterBtns.length && caseCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-cat");
        filterBtns.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });

        var shown = 0;
        caseCards.forEach(function (card) {
          var match = cat === "all" || card.getAttribute("data-cat") === cat;
          card.classList.toggle("hide", !match);
          if (match) {
            shown++;
            // 过滤后新出现的卡片直接显示，不等滚动动画
            card.classList.add("visible");
          }
        });

        if (caseEmpty) caseEmpty.hidden = shown > 0;
      });
    });
  }

  /* ---------- 返回顶部 ---------- */
  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 页脚年份 ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
