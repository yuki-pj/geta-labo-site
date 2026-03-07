/* ============================================
   GETA LABO — メインスクリプト
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- ヘッダーのスクロール変化 ---------- */
  var header = document.getElementById("header");

  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader);
  updateHeader();

  /* ---------- ハンバーガーメニュー ---------- */
  var hamburger = document.getElementById("hamburger");
  var navOverlay = document.getElementById("navOverlay");
  var hamburgerLabel = document.getElementById("hamburgerLabel");
  var navLinks = document.querySelectorAll(".nav-link");

  function toggleMenu() {
    hamburger.classList.toggle("is-active");
    navOverlay.classList.toggle("is-open");

    var isOpen = navOverlay.classList.contains("is-open");
    hamburgerLabel.textContent = isOpen ? "CLOSE" : "MENU";
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function closeMenu() {
    hamburger.classList.remove("is-active");
    navOverlay.classList.remove("is-open");
    hamburgerLabel.textContent = "MENU";
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", toggleMenu);

  // メニューリンクをクリックしたらメニューを閉じる
  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  /* ---------- スクロール連動フェードインアニメーション ---------- */
  var fadeElements = document.querySelectorAll(".fade-in");

  var observerOptions = {
    root: null,
    rootMargin: "0px 0px -80px 0px",
    threshold: 0.1
  };

  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  /* ---------- スムーススクロール ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;

      var target = document.querySelector(targetId);
      if (target) {
        var headerHeight = header.offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });

});
