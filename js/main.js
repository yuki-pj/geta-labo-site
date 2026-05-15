/* ============================================
   GETA LABO — メインスクリプト
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- ヘッダーのスクロール変化 ---------- */
  var header = document.getElementById("header");

  function updateHeader() {
    var concept = document.getElementById("concept");
    var pastConcept = concept ? concept.getBoundingClientRect().bottom <= 0 : window.scrollY > 60;
    if (pastConcept) {
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

  /* ---------- 商品カード スクロール固定スライドイン ---------- */
  var productsWrapper = document.querySelector('.products-scroll-wrapper');
  var slideItems = document.querySelectorAll('.slide-from-right');

  slideItems.forEach(function (item) {
    item.style.opacity = '0';
    item.style.transform = 'translateX(' + window.innerWidth + 'px)';
  });

  function updateProductsScroll() {
    if (!productsWrapper || slideItems.length === 0) return;

    var wRect = productsWrapper.getBoundingClientRect();
    var maxScroll = productsWrapper.offsetHeight - window.innerHeight;
    var scrolled = -wRect.top;

    if (scrolled < 0) return;

    var progress = Math.min(1, scrolled / maxScroll);
    var total = slideItems.length;

    slideItems.forEach(function (item, i) {
      var phaseSize = 1 / total;
      var cardProgress = Math.max(0, Math.min(1, (progress - i * phaseSize) / phaseSize));

      item.style.transform = 'translateX(' + (1 - cardProgress) * window.innerWidth + 'px)';
      item.style.opacity = String(Math.min(1, cardProgress * 2));
    });
  }

  window.addEventListener('scroll', updateProductsScroll, { passive: true });
  updateProductsScroll();

  /* ---------- ニュースフィルタータブ ---------- */
  var newsTabs = document.querySelectorAll(".news-tab");
  var newsItems = document.querySelectorAll(".news-item");

  newsTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var filter = this.getAttribute("data-filter");

      newsTabs.forEach(function (t) { t.classList.remove("is-active"); });
      this.classList.add("is-active");

      newsItems.forEach(function (item) {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.classList.remove("is-hidden");
        } else {
          item.classList.add("is-hidden");
        }
      });
    });
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
